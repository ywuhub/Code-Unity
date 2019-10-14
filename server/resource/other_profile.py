from flask_restful import Resource

# Other user's profile.
class OtherProfile(Resource):
    def get(self, uid: int):
        return f"{uid}'s profile information"
