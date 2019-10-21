from flask_jwt_extended import current_user, jwt_required
from flask_restful import Resource, reqparse
from server.managers.user_manager import UserManager
from server.utils.json import marshal
from server.models.user import profile_fields


class ProfileResource(Resource):
    @jwt_required
    def get(self):
        profile = UserManager.get_instance().get_user_profile(current_user)
        return marshal(profile, profile_fields)

    @jwt_required
    def put(self):
        parser = reqparse.RequestParser(bundle_errors=True)
        parser.add_argument("name", store_missing=False)
        parser.add_argument("email", store_missing=False)
        parser.add_argument("visibility", store_missing=False)
        parser.add_argument("description", store_missing=False)
        parser.add_argument("interests", action="append", store_missing=False)
        parser.add_argument(
            "programming_languages", action="append", store_missing=False
        )
        parser.add_argument("languages", action="append", store_missing=False)
        parser.add_argument("github", store_missing=False)
        profile_dict = parser.parse_args(strict=True)
        UserManager.get_instance().put_user_profile(current_user, profile_dict)
        return {"message": "success"}
