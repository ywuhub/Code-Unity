from bson import ObjectId
from bson.errors import InvalidId
from flask_jwt_extended import jwt_required
from flask_restful import Resource, fields, marshal

from server import db
from server.utils.json import ObjectId as ObjectIdUnmarshaller

project_fields = {
    "leader": ObjectIdUnmarshaller,
    "max_people": fields.Integer,
    "cur_people": fields.Integer,
    "members": fields.List(ObjectIdUnmarshaller),
    "description": fields.String,
    "course": fields.Integer,
    "technologies": fields.List(fields.String),
    "languages": fields.List(fields.String),
    "tags": fields.List(fields.String),
}


class Project(Resource):
    def get(self, project_id: str):
        try:
            id = ObjectId(project_id)
        except InvalidId as err:
            return {"message": f"invalid project_id: {project_id}"}, 422

        doc = db.get_collection("projects").find_one({"_id": id})
        if doc is None:
            return {"message": f"project_id {project_id} not found"}, 404
        return marshal(doc, project_fields)

    @jwt_required
    def put(self, project_id: str):
        return f"updating project_id {project_id}"

    @jwt_required
    def delete(self, project_id: str):
        return f"delete project_id {project_id}"
