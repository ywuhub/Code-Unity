from flask_restful import reqparse, Resource
from argon2 import PasswordHasher
from argon2.exceptions import VerificationError
from flask_jwt_extended import create_access_token

ph = PasswordHasher(time_cost=1, memory_cost=51200, parallelism=2)

# Hash of "password"
TEST_HASH = (
    "$argon2id$v=19$m=51200,t=1,p=2$tBXOVm60xvGteaLOvYIxpg$3JzlTz3pf1hGkpInpBsm5Q"
)


class Auth(Resource):
    post_parser = reqparse.RequestParser()
    post_parser.add_argument(
        "username", type=str, required=True, help="Username required"
    )
    post_parser.add_argument(
        "password", type=str, required=True, help="Password required"
    )

    # Example test:
    # curl -v -d '{"username":"user","password":"pass"}' -H "Content-Type: application/json" -X POST localhost:8080/api/auth
    def post(self):
        args = self.post_parser.parse_args(strict=True)
        username = args["username"]
        pwd = args["password"]

        try:
            ph.verify(TEST_HASH, pwd)
        except VerificationError:
            return f"incorrect username or password", 401

        # The identity of the user should be a uid once the database is set up.
        token = create_access_token(identity=1)
        return {"uid": 1, "token": token}

    put_parser = reqparse.RequestParser()
    put_parser.add_argument(
        "username", type=str, required=True, help="Username required"
    )
    put_parser.add_argument(
        "password", type=str, required=True, help="Password required"
    )

    def put(self):
        args = self.put_parser.parse_args(strict=True)
        username = args["username"]
        password = ph.hash(args["password"])
        return f"registered user {username} with pwd hash {password}"
