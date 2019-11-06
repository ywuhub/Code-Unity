from bson import ObjectId
from bson.errors import InvalidId
from flask_jwt_extended import current_user, jwt_required
from flask_restful import Resource
from flask_restful.reqparse import RequestParser
from pymongo.errors import DuplicateKeyError

from server.exceptions import AlreadyMemberOf, ProjectFull, ProjectNotFound
from server.managers.project_manager import ProjectManager


class ProjectJoin(Resource):
    def __init__(self, project_manager: ProjectManager):
        self.project_manager = project_manager

    @jwt_required
    def post(self, project_id: str):
        """
        Request to join a group. The owner of the project will have to accept the
        user before they are actually considered part of the group.

        Expects:
        ```json
        {
            # Can be omitted if the user provides no join message.
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
        parser = RequestParser()
        parser.add_argument("message")
        args = parser.parse_args(strict=True)

        try:
            project_id = ObjectId(project_id)
        except InvalidId:
            return {"message": "invalid project_id"}, 400

        try:
            current_user.apply_to_project(project_id, args["message"])
        except ProjectNotFound:
            return {"message": "project not found"}, 404
        except DuplicateKeyError:
            return {"message": "request already pending"}, 400
        except ProjectFull:
            return {"message": "project is full"}, 400
        except AlreadyMemberOf:
            return {"message": "already a member"}, 400

        return {"status": "success"}

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
        try:
            project_id = ObjectId(project_id)
        except InvalidId:
            return {"message": "invalid project_id"}, 400

        try:
            current_user.delete_project_application(project_id)
        except ProjectNotFound:
            return {"message": "join request not found"}, 404

        return {"status": "success"}
