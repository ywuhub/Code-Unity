from flask import request
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


def _stringify_objectids(data):
    for project in data:
        project["_id"] = str(project["_id"])
        project["leader"]["_id"] = str(project["leader"]["_id"])
        for mem in project["members"]:
            mem["_id"] = str(mem["_id"])


class ProjectList(Resource):
    def __init__(self, project_manager: ProjectManager):
        self.project_manager = project_manager

    def get(self):
        """
        Returns a list of the current user's involved projects or
        every project's title and their project_id.

        Examples:
        ```
        GET ->
        (200 OK) <-
            [
                {
                    "project_id": "5dac029b8b819e584ff36f8d",
                    "title": "Code Unity",
                    "leader": {
                        "_id": "5dabfe830ddd57902efd2fa3",
                        "username": "john"
                    },
                    "cur_people": 1,
                    "members": [
                        {
                            "_id": "5daa6efd8805c462ef0d16e1",
                            "username": "testuser"
                        },
                        {
                            "_id": "5dabfe830ddd57902efd2fa3",
                            "username": "john"
                        }
                    ],
                    "description": "Nice.",
                    "course": "4920",
                    "tags": [
                        "wam booster",
                        "free hd",
                    ],
                    "languages": [
                        "chinese",
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
        user_id = request.args.get("user_id")
        if user_id == None:
            ret = self.project_manager.get_project_listing()
        else:
            ret = self.project_manager.get_project_listing(user_id)

        _stringify_objectids(ret)

        return ret


class SearchProjects(Resource):
    """
    Fetches the projects according to the search filter
    Parameter:
    - title: string (title of the group project)
    - courses: list (list of courses)
    - languages: list (languages spoken by group)
    - programming_languages: list (programming languages used in project)
    - group_crit: "true" or "false" or else it will default to "None"
                  (group the four criterias above as a union condition for the search or not)
    """

    def __init__(self, project_manager: ProjectManager):
        self.project_manager = project_manager

    def get(self):
        # assign the url encoded parameters into python variables
        title = request.args.get("title")
        courses = request.args.getlist("courses")
        languages = request.args.getlist("languages")
        programming_languages = request.args.getlist("programming_languages")
        group_crit = request.args.get("group_crit")

        # return resultant filtered projects
        return marshal(self.project_manager.search_project_listing(title,
                                                                   courses,
                                                                   languages,
                                                                   programming_languages,
                                                                   group_crit), fields) 
