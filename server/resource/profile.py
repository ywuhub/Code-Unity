from argon2 import PasswordHasher
from flask_jwt_extended import current_user, jwt_required
from flask_restful import Resource, reqparse
from server.managers.user_manager import UserManager
from server.utils.json import marshal
from server.models.user import profile_fields, account_fields, User

from typing import cast

# password hasher to encode incoming user passwords for updating account information
ph = PasswordHasher(time_cost=1, memory_cost=51200, parallelism=2)

class ProfileResource(Resource):
    @jwt_required
    def get(self):
        """
        Returns user profile information for an authenticated user.
        Will return 401/422 if user is not authenticated.

        Returns:
        ```json
            {
                "_id": string,
                "name": string,
                "email": string,
                "visibility": string,
                "description": string,
                "interests": string[],
                "programming_languages": string[],
                "languages": string[],
                "github": string
            }
        ```
        """
        # Hack to get proper type annotation working, casting doesn't do anything
        # at runtime. Should optimally create a proxy for current_user to annotate
        # the return of a User object.
        profile = cast(User, current_user).profile
        return marshal(profile, profile_fields)

    @jwt_required
    def put(self):
        """
        Replaces the information of the currently logged in user's profile with
        the supplied information. All fields are optional.
        Will return 401/422 if user is not authenticated.

        Expects:
        ```json
            {
                "name": string,
                "email": string,
                "visibility": string, // "public" or "private
                "description": string,
                "interests": string[],
                "programming_languages": string[],
                "languages": string[],
                "github": string
            }
        ```
        """
        parser = reqparse.RequestParser(bundle_errors=True)
        parser.add_argument("name", store_missing=False)
        parser.add_argument("email", store_missing=False)
        parser.add_argument("visibility", store_missing=False)
        parser.add_argument("description", store_missing=False)
        parser.add_argument("interests", action="append", store_missing=False)
        parser.add_argument(
            "programming_languages", action="append", store_missing=False
        )
        parser.add_argument("languages", action="append", store_missing=False)
        parser.add_argument("github", store_missing=False)
        profile_dict = parser.parse_args(strict=True)

        cast(User, current_user).update_profile(profile_dict)
        return {"message": "success"}

class AccountResource(Resource):  
    @jwt_required
    def get(self):
        """
            Returns the account information for the currently logged in user.
            Will return 401/422 if user is not authenticated.

            Returns:
            ```json
                {
                    "_id": string,
                    "name": string,
                    "password": string,
                }
            ```
        """
        account = cast(User, current_user).account
        return marshal(account, account_fields)

    @jwt_required
    def put(self):
        """
        Updates the currently logged in user's account information. 
        All fields are optional.
        Will return 401/422 if user is not authenticated.

        Expects:
        ```json
            {
                "username": string,
                "password": string,
            }
        ```
        """
        # fetch parameters from user post request
        parser = reqparse.RequestParser(bundle_errors=True)
        parser.add_argument("username", store_missing=False)
        parser.add_argument("password", store_missing=False)
        account_dict = parser.parse_args(strict=True)

        # encode password
        if 'password' in account_dict.keys():
            account_dict["password"] = ph.hash(account_dict["password"])

        # update account information
        result = cast(User, current_user).update_account(account_dict)
        return {"message": result}
