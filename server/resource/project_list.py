from flask_restful import Resource, fields, marshal

from server import db
from server.utils.json import ObjectId

fields = {"title": fields.String, "project_id": ObjectId(attribute="_id")}


class ProjectList(Resource):
    def get(self):
        ret = []
        # Only return the _id and title fields.
        for doc in db.get_collection("projects").find(projection=["title"]):
            ret.append(doc)
        return marshal(ret, fields)
