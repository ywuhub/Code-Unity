from flask_restful import Resource


class Profile(Resource):
    def get(self):
        return "user profile information"

    def put(self):
        return "update user information"
