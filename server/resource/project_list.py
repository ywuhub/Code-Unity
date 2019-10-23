from flask_restful import Resource, fields, marshal

from server.managers.project_manager import ProjectManager
from server.utils.json import ObjectId

fields = {"title": fields.String, "project_id": ObjectId(attribute="_id")}


class ProjectList(Resource):
    def __init__(self, project_manager: ProjectManager):
        self.project_manager = project_manager

    def get(self):
        """
        Returns a list of every project's title and their project_id.

        Examples:
        ```
        GET ->
        (200 OK) <-
            [
                {
                    "title": "ok test project please ignore",
                    "project_id": "5dabdced46e6be107d2a1f98"
                },
                {
                    "title": "better test project please ignore",
                    "project_id": "5dabf1c0026f1a0cfff5d422"
                }
            ]
        ```
        """
        return marshal(self.project_manager.get_project_listing(), fields)
