from bson import ObjectId
from flask_jwt_extended import get_current_user, jwt_required
from flask_restful import Resource

from server import user_manager


class LogOut(Resource):
    @jwt_required
    def post(self):
        """
        Logs out an authenticated user. Requires no body.
        Will return a 200 response if successfully logged out,
        or a 401 if the current user is not logged in.
        """
        user_manager.log_out_user()
        return {"msg": "Successfully logged out"}
