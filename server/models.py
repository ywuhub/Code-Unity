from flask_restful import reqparse, Resource

class Auth(Resource):
    parser = reqparse.RequestParser()
    parser.add_argument("username", type=str, required=True, help="Username required")
    parser.add_argument("password", type=str, required=True, help="Password required")

    def post(self):
        args = self.parser.parse_args(strict=True)
        return {"username":args["username"], "password":args["password"]}, 200

class User(Resource):
    def get(self, uid):
        return {"uid": uid}
