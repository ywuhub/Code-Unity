from flask_restful import reqparse, Resource


class Auth(Resource):
    parser = reqparse.RequestParser()
    parser.add_argument("username", type=str, required=True, help="Username required")
    parser.add_argument("password", type=str, required=True, help="Password required")

    # Example test:
    # curl -v -d '{"username":"user","password":"pass"}' -H "Content-Type: application/json" -X POST localhost:8080/api/auth
    def post(self):
        args = self.parser.parse_args(strict=True)
        return f"logged in as user {args['username']}"

    def put(self):
        args = self.parser.parse_args(strict=True)
        return f"registered user {args['username']}"
