from flask_restful import Resource
from flask_jwt_extended import jwt_required

class Project(Resource):
    def get(self, project_id: int):
        return f"information about project_id {project_id}"

    @jwt_required
    def put(self, project_id: int):
        return f"updating project_id {project_id}"

    @jwt_required
    def delete(self, project_id: int):
        return f"delete project_id {project_id}"
