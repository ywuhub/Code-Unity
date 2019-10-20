from flask_restful import Resource, fields, marshal_with

from server import db


class ObjectId(fields.Raw):
    """
    Unmarshalling helper class for bson.ObjecId
    """

    def format(self, value):
        return str(value)


fields = {"title": fields.String, "project_id": ObjectId(attribute="_id")}


class ProjectList(Resource):
    @marshal_with(fields)
    def get(self):
        ret = []
        # Only return the _id and title fields.
        for doc in db.get_collection("projects").find(projection=["title"]):
            ret.append(doc)
        return ret
