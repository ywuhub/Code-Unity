from bson import ObjectId
from bson.errors import InvalidId
from flask_jwt_extended import current_user, jwt_required
from flask_restful import Resource, reqparse

from server.managers.project_manager import ProjectManager


class ProjectJoin(Resource):
    def __init__(self, project_manager: ProjectManager):
        self.project_manager = project_manager

    @jwt_required
    def post(self, project_id: str):
        """
        Allows a user to request membership of a specified project based on its ID.
        The owner of the project will have to accept the user before they are actually
        considered part of the group.

        Expects:
        ```json
        {
            # Can be an empty string if the user provides no join message.
            "message": string
        }
        ```

        Examples:
        ```
        POST /api/project/<str:project_id>/request ->
        (200 OK) <-

        # If user is already in the project
        (400 BAD REQUEST) <-
        {
            "message": "already a member"
        }

        # If user has already sent a request
        (400 BAD REQUEST) <-
        {
            "message": "request already pending"
        }

        # If project is already full
        (400 BAD REQUEST) <-
        {
            "message": "project is full"
        }
        ```
        """
        pass

    @jwt_required
    def delete(self, project_id: str):
        """
        Removes a join request. Will return with status code 400 if the user does
        not have a pending request for the project.

        Example:
        ```
        DELETE /api/project/<str:project_id>/request ->
        (200 OK) <-
        ```
        """
        pass
