from flask_jwt_extended import jwt_required
from flask_restful import Resource


# Other user's profile.
class OtherProfile(Resource):
    @jwt_required
    def get(self, username: str):
        return f"{username}'s profile information"
