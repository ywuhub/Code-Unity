from flask_jwt_extended import current_user, jwt_required
from flask_restful import Resource

from server.managers.project_manager import ProjectManager


class ProjectJoinList(Resource):
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
                "project_name": string
            }
        ]

        GET ?incoming=true ->
        (200 OK) <-
        [
            {
                "project_id": string,
                "project_name": string,
                "user_id": string,
                "user_name": string,
                "user_message": string
            }
        ]
        ```
        """
        pass
