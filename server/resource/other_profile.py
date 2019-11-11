from bson import ObjectId
from bson.errors import InvalidId
from flask_jwt_extended import jwt_required
from flask_restful import Resource

from server.managers.user_manager import UserManager
from server.models.user import profile_fields
from server.utils.json import marshal


# Other user's profile.
class OtherProfile(Resource):
    def __init__(self, user_manager: UserManager):
        self.user_manager = user_manager

    @jwt_required
    def get(self, uid: str):
        """
        Login required. Returns a profile for the user specified. Will return
        reduced information if the profile specified is marked as private.

        Example:
        ```
        GET ->
        # If the profile is public
        (200 OK) <-
        {
            "_id": "string",
            "username": "string",
            "name": "string",
            "email": "string",
            "visibility": "string",
            "description": "string",
            "interests": ["string"],
            "programming_languages": ["string"],
            "languages": ["string"],
            "github": "string"
        }
        # If the profile is private
        (200 OK) <-
        {
            "_id": "string",
            "username": "string",
            "visibility": "string"
        }
        ```
        """
        try:
            uid = ObjectId(uid)
        except InvalidId:
            return {"message": f"invalid user_id: {uid}"}, 422

        data = self.user_manager.get_user_profile(uid)
        if data is None:
            return {"message": "user not found"}, 404

        # Project the items in the "profile" sub dictionary up. Could be done
        # on the database side as well but projection isn't very extensible.
        for k, v in data["profile"].items():
            data[k] = v

        # If the profile is private, return only a few select fields.
        if data["visibility"] == "private":
            reduced_fields = ("_id", "username", "visibility")
            reduced_profile = {k: v for k, v in data.items() if k in reduced_fields}
            return marshal(reduced_profile, profile_fields)

        return marshal(data, profile_fields)
