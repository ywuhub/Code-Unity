from flask_jwt_extended import current_user, jwt_required
from flask_restful import Resource, fields
from flask_restful.reqparse import RequestParser

from server.managers.project_manager import ProjectManager
from server.utils.json import ObjectId, marshal

fields = {
    "project_id": ObjectId,
    "project_title": fields.String,
    "user_id": fields.String,
    "user_name": fields.String,
}


class UserInviteList(Resource):
    @jwt_required
    def get(self):
        parser = RequestParser()
        parser.add_argument("incoming")
        incoming = parser.parse_args(strict=True)["incoming"]

        if incoming is not None and incoming.lower() == "true":
            result = current_user.get_incoming_invitations()
            return marshal(result, fields)

        result = current_user.get_outgoing_invitations()
        return marshal(result, fields)
