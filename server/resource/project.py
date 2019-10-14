from flask_restful import Resource


class Project(Resource):
    def get(self, project_id: int):
        return f"information about project_id {project_id}"

    def put(self, project_id: int):
        return f"updating project_id {project_id}"

    def delete(self, project_id: int):
        return f"delete project_id {project_id}"
