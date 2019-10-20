from bson import ObjectId
from bson.errors import InvalidId
from flask_jwt_extended import current_user, jwt_required
from flask_restful import Resource, marshal

from server.managers.project_manager import ProjectManager
from server.models.project import project_fields


class Project(Resource):
    def get(self, project_id: str):
        try:
            id = ObjectId(project_id)
        except InvalidId as err:
            return {"message": f"invalid project_id: {project_id}"}, 422

        doc = ProjectManager.get_instance().get_project(id)
        if doc is None:
            return {"message": f"project_id {project_id} not found"}, 404
        return marshal(doc, project_fields)

    @jwt_required
    def put(self, project_id: str):
        return f"updating project_id {project_id}"

    @jwt_required
    def delete(self, project_id: str):
        try:
            id = ObjectId(project_id)
        except InvalidId as err:
            return {"message": f"invalid project_id: {project_id}"}, 422
        pm = ProjectManager.get_instance()
        project = pm.get_project(id)
        if project is None:
            return {"message": f"project_id {project_id} not found"}, 404
        if current_user._id != project.leader:
            return {"message": "only the owner may delete a project"}, 401

        pm.delete_project(project)
        return {"message": "successfully deleted the project"}
