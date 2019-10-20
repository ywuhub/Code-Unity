from flask_jwt_extended import current_user, jwt_required
from flask_restful import Resource, reqparse

from server.models.project import Project


class NewProject(Resource):
    @jwt_required
    def post(self):
        parser = reqparse.RequestParser(bundle_errors=True)
        parser.add_argument("title", required=True)
        parser.add_argument("max_people", type=int, required=True)

        # Optional fields
        for k in Project.single_valued_keys:
            parser.add_argument(k)
        for k in Project.multi_valued_keys:
            parser.add_argument(k, action="append")
        args = parser.parse_args(strict=True)

        if args["course"] is not None:
            # TODO: course validation
            pass

        if args["technologies"] is not None:
            # TODO: ech validation
            pass

        if args["tags"] is not None:
            # TODO: tag validation
            pass

        title = args.pop("title")
        max_people = args.pop("max_people")
        project_id = current_user.create_project(title, max_people, **args)
        return {"project_id": str(project_id)}
