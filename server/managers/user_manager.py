import re
from typing import Dict, Set, Tuple

from argon2 import PasswordHasher
from bson import ObjectId
from flask import Flask
from flask_jwt_extended import (
    JWTManager,
    create_access_token,
    get_raw_jwt,
    jwt_required,
)
from pymongo.database import Database
from pymongo.errors import DuplicateKeyError

from server.managers.notification_manager import NotificationManager
from server.models.user import User

ph = PasswordHasher(time_cost=1, memory_cost=51200, parallelism=2)


class ValueExistsError(Exception):
    """
    ValueExistsError is thrown by UserManager when a unique field in the database
    would be violated by a database operation.
    """

    def __init__(self, errors: Dict[str, str] = None):
        if errors is None:
            self._errors: Dict[str, str] = {}
        else:
            self._errors = errors

    def append(self, key: str, val: str):
        self._errors[key] = val

    @property
    def errors(self) -> Dict[str, str]:
        """
        errors returns a dict where each item's key is the unique field that has been
        violated, and the value of the key holds a coresponding message.
        """
        return self._errors


class UserManager:
    def __init__(
        self, app: Flask, db: Database, jwt: JWTManager, nm: NotificationManager
    ):
        self.users = db.get_collection("users")
        self.profiles = db.get_collection("profiles")
        # In memory store of revoked tokens. WARNING: will allow logged out users to
        # log back in if app is restarted.
        self.revoked_tokens: Set[str] = set()
        self.nm = nm

        # Overrides the default function of jwt.current_user to return a User object.
        @jwt.user_loader_callback_loader
        def user_loader_callback(id: str):
            return User(ObjectId(id), db, nm)

        # Check for revoked tokens.
        @jwt.token_in_blacklist_loader
        def check_if_token_in_blacklist(decrypted_token: Dict[str, str]):
            jti = decrypted_token["jti"]
            return jti in self.revoked_tokens

    def register_user(self, username: str, email: str, password: str):
        """
        register_user attempts to register a new user given their username,
        email, and password.

        Raises: [ValueExistsError]

        If the username or email is already in use, it raises a ValueExistsError.
        """
        # Check if there exists anyone with the same username or email
        username_check = self.users.find_one({"username": username})
        email_check = self.users.find_one({"email": email})
        if username_check is not None or email_check is not None:
            err = ValueExistsError()
            if username_check is not None:
                err.append("username", "Specified username is in use")
            if email_check is not None:
                err.append("email", "Specified email is in use")
            raise err

        pwd_hash = ph.hash(password)

        # Race conditions possible, check if database throws an error about
        # a duplicate username/email key.
        try:
            # add user to 'users' database
            default_avatar = (
                "https://api.adorable.io/avatars/200/code_unity_default.png"
            )
            _id = self.users.insert_one(
                {
                    "username": username,
                    "password": pwd_hash,
                    "email": email,
                    "avatar": default_avatar,
                }
            )
            # initiate blank profile for newly registered user
            self.profiles.insert_one(
                {
                    "_id": ObjectId(_id.inserted_id),
                    "name": "",
                    "email": email,
                    "visibility": "public",
                    "description": "",
                    "interests": [],
                    "programming_languages": [],
                    "languages": [],
                    "github": "",
                }
            )
        except DuplicateKeyError as err:
            # The error message returned from pymongo is messy, extract the
            # key in question and raise it as a ValueExistsError.
            test_str = str(err)
            regex = r".*\$(.*)_1 dup key: .*"
            dup_key = re.findall(regex, test_str, re.DOTALL)[0]

            err = ValueExistsError()
            err.append(dup_key, f"Specified {dup_key} is in use")
            raise err

        # Successfully registered user, logging them in.
        return self.log_in_user(username, password)

    def log_in_user(self, username: str, password: str) -> Tuple[str, str]:
        """
        log_in_user attempts to log in a user given their username and password.
        
        Raises: [ValueError, VerificationError]
        - ValueError if username is not found.
        - VerificationError if it does not match up.
        """
        user = self.users.find_one({"username": username})
        if user is None:
            raise ValueError
        # ph.verify raises a VerificationError on mismatch
        ph.verify(user["password"], password)

        uid = str(user["_id"])
        token: str = create_access_token(identity=uid)
        return str(user["_id"]), token

    @jwt_required
    def log_out_user(self):
        """
        Logs out a currently logged in user.
        """
        jti: str = get_raw_jwt()["jti"]
        self.revoked_tokens.add(jti)

    def get_user_profile(self, uid: ObjectId):
        pipeline = [
            {"$match": {"_id": uid}},
            {
                "$lookup": {
                    "from": "profiles",
                    "localField": "_id",
                    "foreignField": "_id",
                    "as": "profile",
                }
            },
            {"$unwind": "$profile"},
        ]
        try:
            return self.users.aggregate(pipeline).next()
        except StopIteration:
            # UID not found
            return None

    def get_user_account(self, uid: ObjectId):
        pipeline = [
            {"$match": {"_id": uid}},
            {
                "$lookup": {
                    "from": "users",
                    "localField": "_id",
                    "foreignField": "_id",
                    "as": "user",
                }
            },
            {"$unwind": "$user"},
        ]
        try:
            return self.users.aggregate(pipeline).next()
        except StopIteration:
            # Invalid UserID
            return None
