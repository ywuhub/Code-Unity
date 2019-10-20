from flask_restful import Resource
from server import db

_cache = []


class ProgrammingLanguages(Resource):
    def get(self):
        """
        Retruns a list of all valid programming languages.

        Example:
        ```
        GET ->
        (200 OK) <-
            [
                "A# .NET",
                "A-0 System",
                "A+",
                "A++",
                "ABAP",
                "ABC"
            ]
        ```
        """
        if len(_cache) == 0:
            for doc in db["prog_langs"].find({}):
                _cache.append(doc["name"])
        return _cache
