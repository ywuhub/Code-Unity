import re
from typing import Dict

from argon2 import PasswordHasher
from flask import Flask
from flask_jwt_extended import create_access_token
from pymongo.database import Database
from pymongo.errors import DuplicateKeyError

ph = PasswordHasher(time_cost=1, memory_cost=51200, parallelism=2)


class ValueExistsError(Exception):
    def __init__(self):
        self.errors: Dict[str, str] = {}

    def append(self, key: str, val: str):
        self.errors[key] = val


class UserManager:
    def __init__(self, app: Flask, db: Database):
        self.users = db.get_collection("users")

    # May raise pymongo.errors.DuplicateKeyError
    def register_user(self, username: str, email: str, password: str):
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

        # race conditions possible, check if database throws an error about
        # a duplicate username/email key.
        try:
            self.users.insert_one(
                {"username": username, "password": pwd_hash, "email": email}
            )
        except DuplicateKeyError as err:
            # the error message returned from pymongo is messy, extract the
            # key in question and raise it as a ValueExistsError.
            test_str = str(err)
            regex = r".*\$(.*)_1 dup key: .*"
            dup_key = re.findall(regex, test_str, re.DOTALL)[0]

            err = ValueExistsError()
            err.append(dup_key, f"Specified {dup_key} is in use")
            raise err

        # successfully registered user, log 'em in
        return self.log_in_user(username, password)

    # Raises ValueError if username is not found, Verification Error if it does
    # not match up.
    def log_in_user(self, username: str, password: str):
        user = self.users.find_one({"username": username})
        if user is None:
            raise ValueError
        # This throws VerificationError if ph.verify fails.
        ph.verify(user["password"], password)
        uid = str(user["_id"])
        token = create_access_token(identity=uid)
        return str(user["_id"]), token
