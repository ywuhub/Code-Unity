from argon2.exceptions import VerificationError
from flask_restful import Resource, reqparse

from server import user_manager
from server.managers.user_manager import ValueExistsError


class Auth(Resource):
    def post(self):
        post_parser = reqparse.RequestParser()
        post_parser.add_argument(
            "username", type=str, required=True, help="Username required"
        )
        post_parser.add_argument(
            "password", type=str, required=True, help="Password required"
        )
        args = post_parser.parse_args(strict=True)

        username = args["username"]
        pwd = args["password"]
        try:
            uid, token = user_manager.log_in_user(username, pwd)
        except (VerificationError, ValueError):
            return f"incorrect username or password", 401

        return {"uid": uid, "token": token}

    def put(self):
        put_parser = reqparse.RequestParser()
        put_parser.add_argument(
            "username", type=str, required=True, help="Username required"
        )
        put_parser.add_argument(
            "password", type=str, required=True, help="Password required"
        )
        put_parser.add_argument("email", type=str, required=True, help="Email required")
        args = put_parser.parse_args(strict=True)

        username = args["username"]
        email = args["email"]
        password = args["password"]

        try:
            uid, token = user_manager.register_user(username, email, password)
            return {"uid": uid, "token": token}
        except ValueExistsError as err:
            return {"message": err.errors}, 422
