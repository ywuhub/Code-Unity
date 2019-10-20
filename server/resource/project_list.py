from flask_restful import Resource, fields, marshal

from server.managers.project_manager import ProjectManager
from server.utils.json import ObjectId

fields = {"title": fields.String, "project_id": ObjectId(attribute="_id")}


class ProjectList(Resource):
    def get(self):
        return marshal(ProjectManager.get_instance().get_project_listing(), fields)
