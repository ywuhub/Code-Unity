from flask_restful import Resource
from flask_jwt_extended import jwt_required, get_jwt_identity


class Profile(Resource):
    @jwt_required
    def get(self):

        return f"user profile information for {get_jwt_identity()}"

    @jwt_required
    def put(self):
        return f"update user information for {get_jwt_identity()}"
