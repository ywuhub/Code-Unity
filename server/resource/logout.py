from flask_jwt_extended import jwt_required
from flask_restful import Resource

from server.managers.user_manager import UserManager


class LogOut(Resource):
    def __init__(self, user_manager: UserManager):
        self.user_manager = user_manager

    @jwt_required
    def post(self):
        """
        Logs out an authenticated user. Requires no body.
        Will return a 200 response if successfully logged out,
        or a 401 if the current user is not logged in.
        """
        self.user_manager.log_out_user()
        return {"msg": "Successfully logged out"}
