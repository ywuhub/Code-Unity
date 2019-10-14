from flask_restful import reqparse, Resource


class User(Resource):
    def get(self):
        return "user profile information"

    def put(self):
        return "update user information"


class Auth(Resource):
    parser = reqparse.RequestParser()
    parser.add_argument("username", type=str, required=True, help="Username required")
    parser.add_argument("password", type=str, required=True, help="Password required")

    # Example test:
    # curl -v -d '{"username":"user","password":"pass"}' -H "Content-Type: application/json" -X POST localhost:8080/api/auth
    def post(self):
        args = self.parser.parse_args(strict=True)
        return f"logged in as user {args['username']}"

    def put(self):
        args = self.parser.parse_args(strict=True)
        return f"registered user {args['username']}"


class NewProject(Resource):
    def post(self):
        return "created a project listing"


class Project(Resource):
    def get(self, project_id: int):
        return f"information about project_id {project_id}"

    def put(self, project_id: int):
        return f"updating project_id {project_id}"

    def delete(self, project_id: int):
        return f"delete project_id {project_id}"


class ProjectList(Resource):
    def get(self):
        return ["{project1}", "{project2}"]
