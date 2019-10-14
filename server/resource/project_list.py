from flask_restful import Resource


class ProjectList(Resource):
    def get(self):
        return ["{project1}", "{project2}"]
