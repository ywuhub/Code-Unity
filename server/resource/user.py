from flask_restful import Resource


class User(Resource):
    def get(self):
        return "user profile information"

    def put(self):
        return "update user information"
