from flask_restful import Resource, fields

from server.managers.project_manager import ProjectManager
from server.utils.json import ObjectId, marshal

fields = {
    "project_id": ObjectId(attribute="_id"),
    "title": fields.String,
    "leader": ObjectId,
    "cur_people": fields.Integer,
    "max_people": fields.Integer,
    "members": fields.List(ObjectId),
    "description": fields.String(default=None),
    "course": fields.String(default=None),
    "tags": fields.List(fields.String),
    "languages": fields.List(fields.String),
    "technologies": fields.List(fields.String),
}


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
                    "project_id": "5dac029b8b819e584ff36f8d",
                    "title": "Code Unity",
                    "leader": "5dabfe830ddd57902efd2fa3",
                    "cur_people": 1,
                    "members": [
                        "5dabfe830ddd57902efd2fa3"
                    ],
                    "description": "Nice.",
                    "course": "4920",
                    "tags": [
                        "wam booster",
                        "free hd",
                    ],
                    "languages": [
                        "中文",
                        "english"
                    ],
                    "technologies": [
                        "python",
                        "mongoDB",
                        "react"
                    ]
                }
            ]
        ```
        """
        return marshal(self.project_manager.get_project_listing(), fields)
