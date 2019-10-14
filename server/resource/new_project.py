from flask_restful import Resource


class NewProject(Resource):
    def post(self):
        return "created a project listing"
