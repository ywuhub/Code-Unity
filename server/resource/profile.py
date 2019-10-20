from flask_jwt_extended import current_user, get_jwt_identity, jwt_required
from flask_restful import Resource


class Profile(Resource):
    @jwt_required
    def get(self):
        return f"user profile information for {current_user}"

    @jwt_required
    def put(self):
        return f"update user information for {current_user}"
