from flask_restful import Resource
from flask_jwt_extended import jwt_required

# Other user's profile.
class OtherProfile(Resource):
    @jwt_required
    def get(self, uid: int):
        return f"{uid}'s profile information"
