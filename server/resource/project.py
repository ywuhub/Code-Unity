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
        the project_id is not found, and 401 if the logged in user does not owned
        the specified project.

        Expects the same JSON format as POST /api/project.
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

        # Create a new Project

        # Parse arguments
        parser = reqparse.RequestParser(bundle_errors=True)
        parser.add_argument("title", required=True)
        parser.add_argument("max_people", type=int, required=True)

        for k in Project.single_valued_keys:
            parser.add_argument(k)
        for k in Project.multi_valued_keys:
            parser.add_argument(k, action="append")
        args = parser.parse_args(strict=True)

        # Pop out the required arguments to instantiate a new project
        title = args.pop("title")
        max_people = args.pop("max_people")
        try:
            new_project = Project(current_user._id, title, max_people, **args)
        except ValueError as err:
            return {"message": str(err)}, 400

        self.project_manager.replace_project(project, new_project)
        return {"message": "successfully replaced project"}

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
