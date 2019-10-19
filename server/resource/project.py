from flask_jwt_extended import jwt_required
from flask_restful import Resource


class Project(Resource):
    def get(self, project_id: str):
        return f"information about project_id {project_id}"

    @jwt_required
    def put(self, project_id: str):
        return f"updating project_id {project_id}"

    @jwt_required
    def delete(self, project_id: str):
        return f"delete project_id {project_id}"
