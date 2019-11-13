from bson import ObjectId
from bson.errors import InvalidId
from flask_jwt_extended import current_user, jwt_required
from flask_restful import Resource, reqparse

from server.managers.project_manager import ProjectManager
from server.models.project import Project, project_fields
from server.utils.json import marshal


class ProjectResource(Resource):
    def __init__(self, project_manager: ProjectManager):
        self.project_manager = project_manager

    def get(self, project_id: str):
        """
        Gets information about a specific project given its project_id. Returns 422 if
        the project_id is not in the correct format. 404 if project_id is not found.

        Example:
        ```
        GET /api/project/5dac029b8b819e584ff36f8d ->
        (200 OK) <-
            {
                "title": "Code Unity",
                "leader": "5dabfe830ddd57902efd2fa3",
                "max_people": 5,
                "cur_people": 1,
                "members": [
                    "5dabfe830ddd57902efd2fa3"
                ],
                "description": "Nice.",
                "course": "4920",
                "technologies": [
                    "assembly",
                    "python",
                    "mongoDB",
                    "react"
                ],
                "languages": [
                    "chinese",
                    "english"
                ],
                "tags": [
                    "wam booster",
                    "free hd",
                    "machine learning",
                    "blockchain"
                ]
            }
        # If project not found
        GET /api//project/ffffffffffffffffffffffff ->
        (404 NOT FOUND) <-
            {
                "message": "project_id ffffffffffffffffffffffff not found"
            }
        # If project_id isn't in the right format
        GET /api//project/ohno ->
        (422 UNPROCESSABLE ENTITY) <-
            {
                "message": "invalid project_id: ohno"
            }
        ```
        """
        try:
            id = ObjectId(project_id)
        except InvalidId:
            return {"message": f"invalid project_id: {project_id}"}, 422

        doc = self.project_manager.get_project(id)
        if doc is None:
            return {"message": f"project_id {project_id} not found"}, 404
        return marshal(doc, project_fields)

    @jwt_required
    def put(self, project_id: str):
        """
        Updates a project that is owned by the logged in user by replacing it
        with the data passed in. Returns 422 if the project_id is invalid, 404 if
        the project_id is not found, and 401 if the logged in user does not own
        the specified project.

        Expects the JSON format:
        {
            "title": "",
            "max_people": ,
            "course": "",
            "description": "",
            "tags": [],
            "technologies": [ ], # programming languages
            "languages": []
        }

        But all parameters are optional.
        """
        try:
            id = ObjectId(project_id)
        except InvalidId:
            return {"message": f"invalid project_id: {project_id}"}, 422

        project = self.project_manager.get_project(id)

        if project is None:
            return {"message": f"project_id {project_id} not found"}, 404
        if current_user._id != project.leader:
            return {"message": "only the owner may modify a project"}, 401
        
        # Parse arguments
        parser = reqparse.RequestParser(bundle_errors=True)
        parser.add_argument("title", store_missing=False)
        parser.add_argument("max_people", type=int, store_missing=False)
        parser.add_argument("course", store_missing=False)
        parser.add_argument("description", store_missing=False)
        parser.add_argument("tags", action="append", store_missing=False)
        parser.add_argument("technologies", action="append", store_missing=False)
        parser.add_argument("languages", action="append", store_missing=False)
        project_details = parser.parse_args(strict=True)

        if project_details:
            # check if new max_people is greater than the current amount of members
            if 'max_people' in project_details.keys():
                if (project_details['max_people'] < project.cur_people):
                    return {"message": "new maximum number of members value is less than current amount of members"}

            # update details in project mamanger
            self.project_manager.update_project(project, project_details)
        
        return {"message": "successfully updated project"}

    @jwt_required
    def delete(self, project_id: str):
        """
        Deletes a project that is owned by the logged in user. Returns 422 if the
        project_id is invalid, 404 if the project_id is not found, and 401 if the
        logged in user does not own the specified project.
        """
        try:
            id = ObjectId(project_id)
        except InvalidId:
            return {"message": f"invalid project_id: {project_id}"}, 422

        project = self.project_manager.get_project(id)

        if project is None:
            return {"message": f"project_id {project_id} not found"}, 404
        if current_user._id != project.leader:
            return {"message": "only the owner may delete a project"}, 401

        self.project_manager.delete_project(project)
        return {"message": "successfully deleted the project"}
