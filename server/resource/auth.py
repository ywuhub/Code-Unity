from argon2.exceptions import VerificationError
from flask_restful import Resource, reqparse

from server.managers.user_manager import UserManager, ValueExistsError


class Auth(Resource):
    def __init__(self, user_manager: UserManager):
        self.user_manager = user_manager

    def post(self):
        """
        Logs a user in. Will return 400 if username or password is not provided, and 401 if the credentials supplied are not valid.

        Expects:

        ```json
        {
            "username": string, # required
            "password": string, # required
        }
        ```

        On success, returns:

        ```json
        {
            "uid":   number,
            "token": string,
        }
        ```

        Examples:
        ```
        POST ->
            {
                "username": "testuser",
                "password": "test"
            }
        (200 OK) <-
            {
                "uid": "5daa7be538fcf92a17e6e8d1",
                "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1NzE0NTM5MjUsIm5iZiI6MTU3MTQ1MzkyNSwianRpIjoiY2NmMDU1OWEtNzE3NS00Yzg5LTg2N2ItOGMzYjE1N2MxMjE5IiwiZXhwIjoxNTcxNDU0ODI1LCJpZGVudGl0eSI6IjVkYWE3YmU1MzhmY2Y5MmExN2U2ZThkMSIsImZyZXNoIjpmYWxzZSwidHlwZSI6ImFjY2VzcyJ9.DPmOF4-XRS4gdzLMewMiTDtKE7zdnFB_9AGKlfepuaA"
            }
        # If missing params
        (400 BAD REQUEST) <-
            {
                "message": {
                    "username": "Username required",
                    "password": "Password required"
                }
            }
        # If incorrect username/password
        (401 UNAUTHORIZED) <-
            {
                "message": "incorrect username or password"
            }
        ```
        """
        # fetch post parameters
        post_parser = reqparse.RequestParser(bundle_errors=True)
        post_parser.add_argument(
            "username", type=str, required=True, help="Username required"
        )
        post_parser.add_argument(
            "password", type=str, required=True, help="Password required"
        )
        args = post_parser.parse_args(strict=True)

        # assign account information parameters to variables
        username = args["username"]
        pwd = args["password"]

        # attempt to login user through the user manager interface
        try:
            uid, token = self.user_manager.log_in_user(username, pwd)
        except (VerificationError, ValueError):
            return {"message": "incorrect username or password"}, 401

        return {"uid": uid, "token": token}

    def put(self):
        """
        Registers a user and then logs them in. Will return 400 if required fields are missing. 422 if a registered user already owns that username or email.

        Expects:

        ```json
        {
            "username": string, # required
            "email": string,    # required
            "password": string, # required
        }
        ```

        On success, returns:

        ```json
        {
            "uid":   number,
            "token": string,
        }
        ```

        Examples:
        ```
        PUT ->
            {
                "username": "testuser",
                "email": "test@user.com",
                "password": "test"
            }
        (200 OK) <-
            {
                "uid": "5daa7be538fcf92a17e6e8d1",
                "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1NzE0NTM5MjUsIm5iZiI6MTU3MTQ1MzkyNSwianRpIjoiY2NmMDU1OWEtNzE3NS00Yzg5LTg2N2ItOGMzYjE1N2MxMjE5IiwiZXhwIjoxNTcxNDU0ODI1LCJpZGVudGl0eSI6IjVkYWE3YmU1MzhmY2Y5MmExN2U2ZThkMSIsImZyZXNoIjpmYWxzZSwidHlwZSI6ImFjY2VzcyJ9.DPmOF4-XRS4gdzLMewMiTDtKE7zdnFB_9AGKlfepuaA"
            }
        # If the email "test@user.com" or username "testuser" is already in use.
        (422 UNPROCESSABLE ENTITY) <-
            {
                "message": {
                    "username": "Specified username is in use",
                    "email": "Specified email is in use"
                }
            }
        # If missing parameters
        PUT -> {}
        (400 BAD REQUEST) <-
            {
                "message": {
                    "username": "Username required",
                    "password": "Password required",
                    "email": "Email required"
                }
            }
        ```
        """
        # fetch the put parameters
        put_parser = reqparse.RequestParser(bundle_errors=True)
        put_parser.add_argument(
            "username", type=str, required=True, help="Username required"
        )
        put_parser.add_argument(
            "password", type=str, required=True, help="Password required"
        )
        put_parser.add_argument("email", type=str, required=True, help="Email required")
        args = put_parser.parse_args(strict=True)

        # assign the account details to variables
        username = args["username"]
        email = args["email"]
        password = args["password"]

        # attempt to register user using the given account details
        try:
            uid, token = self.user_manager.register_user(username, email, password)
            return {"uid": uid, "token": token}
        except ValueExistsError as err:
            return {"message": err.errors}, 422
