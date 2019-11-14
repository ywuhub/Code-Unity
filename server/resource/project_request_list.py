from flask_jwt_extended import current_user, jwt_required
from flask_restful import Resource, fields
from flask_restful.reqparse import RequestParser

from server.managers.project_manager import ProjectManager
from server.utils.json import ObjectId, marshal

outgoing_fields = {
    "project_id": ObjectId,
    "project_title": fields.String,
    "message": fields.String,
}

incoming_fields = {
    "project_id": ObjectId,
    "project_title": fields.String,
    "user_id": fields.String,
    "user_name": fields.String,
    "message": fields.String,
}


class ProjectRequestList(Resource):
    def __init__(self, project_manager: ProjectManager):
        self.project_manager = project_manager

    @jwt_required
    def get(self):
        """
        Allows a user to get a list of pending join requests that they have sent,
        i.e., join requests that are outgoing. If the "incoming" parameter is set
        to true, then the endpoint will return a list of pending incoming join
        requests to the projects that they own. 

        Example:
        ```
        GET ->
        (200 OK) <-
        [
            {
                "project_id": string,
                "project_title": string,
                "message": string
            }
        ]

        GET ?incoming=true ->
        (200 OK) <-
        [
            {
                "project_id": string,
                "project_title": string,
                "user_id": string,
                "user_name": string,
                "message": string
            }
        ]
        ```
        """
        parser = RequestParser()
        parser.add_argument("incoming")
        incoming = parser.parse_args(strict=True)["incoming"]

        if incoming is not None and incoming.lower() == "true":
            result = current_user.get_incoming_join_requests()
            return marshal(result, incoming_fields)

        result = current_user.get_outgoing_join_requests()
        return marshal(result, outgoing_fields)
