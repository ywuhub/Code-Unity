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
        """
        Allows a user to list the invites that they've sent out or the invites
        that other people have sent them if the incoming parameter is set to true.

        Example:
        ```
        # Gets invitations that the user has sent out
        GET ->
        (200 OK) <-
        [
            {
                "project_id": string,
                "project_title": string,
                "user_id": string,
                "user_name": "testuser"  # username of the user invited
            }
        ]

        # Gets invitations that the user has received from others
        GET ?incoming=true ->
        (200 OK) <- 
        [
            {
                "project_id": string,
                "project_title": string,
                "user_id": string,
                "user_name": "testuser"  # username of the user who invited the current user
            }
        ]
        ```
        """
        parser = RequestParser()
        parser.add_argument("incoming")
        incoming = parser.parse_args(strict=True)["incoming"]

        if incoming is not None and incoming.lower() == "true":
            result = current_user.get_incoming_invitations()
            return marshal(result, fields)

        result = current_user.get_outgoing_invitations()
        return marshal(result, fields)
