from flask_restful import Resource
from server import db

_cache = []


class ProgrammingLanguages(Resource):
    def get(self):
        if len(_cache) == 0:
            for doc in db["prog_langs"].find({}):
                _cache.append(doc["name"])
        return _cache
