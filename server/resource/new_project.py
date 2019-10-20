from flask_jwt_extended import current_user, jwt_required
from flask_restful import Resource, reqparse

from server.models.project import Project


class NewProject(Resource):
    @jwt_required
    def post(self):
        """
        Posts a new project listing. Will return 400 if required fields are missing.

        Expects:

        ```json
            {
                "title":        string, # required
                "max_people":   number, # required
                "description":  string,
                "course":       number,
                "tags":         string[],
                "technologies": string[],
                "languages":    string[],
            }
        ```

        On success, returns:

        ```json
            {
                "project_id": string
            }
        ```
        """
        parser = reqparse.RequestParser(bundle_errors=True)
        parser.add_argument("title", required=True)
        parser.add_argument("max_people", type=int, required=True)

        # Optional fields
        for k in Project.single_valued_keys:
            parser.add_argument(k)
        for k in Project.multi_valued_keys:
            parser.add_argument(k, action="append")
        args = parser.parse_args(strict=True)

        title = args.pop("title")
        max_people = args.pop("max_people")
        try:
            project_id = current_user.create_project(title, max_people, **args)
        except ValueError as err:
            return {"message": str(err)}, 400

        return {"project_id": str(project_id)}
