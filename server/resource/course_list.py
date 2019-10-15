from flask_restful import Resource
from server import db


class CourseList(Resource):
    def get(self):
        ret = []
        for doc in db["comp_courses"].find({}).sort("code", 1):
            ret.append({"code": doc["code"], "name": doc["name"]})
        return ret
