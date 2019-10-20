from bson import ObjectId
from bson.errors import InvalidId
from flask_jwt_extended import current_user, jwt_required
from flask_restful import Resource, reqparse

from server.managers.project_manager import ProjectManager
from server.models.project import Project, project_fields
from server.utils.json import marshal


class ProjectResource(Resource):
    def get(self, project_id: str):
        try:
            id = ObjectId(project_id)
        except InvalidId:
            return {"message": f"invalid project_id: {project_id}"}, 422

        doc = ProjectManager.get_instance().get_project(id)
        if doc is None:
            return {"message": f"project_id {project_id} not found"}, 404
        return marshal(doc, project_fields)

    @jwt_required
    def put(self, project_id: str):
        try:
            id = ObjectId(project_id)
        except InvalidId:
            return {"message": f"invalid project_id: {project_id}"}, 422

        pm = ProjectManager.get_instance()
        project = pm.get_project(id)

        if project is None:
            return {"message": f"project_id {project_id} not found"}, 404
        if current_user._id != project.leader:
            return {"message": "only the owner may modify a project"}, 401
        # Create a new Project
        parser = reqparse.RequestParser(bundle_errors=True)
        parser.add_argument("title", required=True)
        parser.add_argument("max_people", type=int, required=True)

        for k in Project.single_valued_keys:
            parser.add_argument(k)
        for k in Project.multi_valued_keys:
            parser.add_argument(k, action="append")
        args = parser.parse_args(strict=True)

        title = args.pop("title")
        max_people = args.pop("max_people")
        try:
            new_project = current_user.new_project(title, max_people, **args)
        except ValueError as err:
            return {"message": str(err)}, 400

        pm.replace_project(project, new_project)
        return {"message": "successfully replaced project"}

    @jwt_required
    def delete(self, project_id: str):
        try:
            id = ObjectId(project_id)
        except InvalidId:
            return {"message": f"invalid project_id: {project_id}"}, 422

        pm = ProjectManager.get_instance()
        project = pm.get_project(id)

        if project is None:
            return {"message": f"project_id {project_id} not found"}, 404
        if current_user._id != project.leader:
            return {"message": "only the owner may delete a project"}, 401

        pm.delete_project(project)
        return {"message": "successfully deleted the project"}
