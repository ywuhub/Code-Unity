from flask_restful import Resource
from pymongo.database import Database

_cache = []


class ProgrammingLanguages(Resource):
    def __init__(self, db: Database):
        self.db = db

    def get(self):
        """
        Returns a list of all valid programming languages.

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
        # fetch all the programming languages from the database to the frontend
        if len(_cache) == 0:
            for doc in self.db["prog_langs"].find({}):
                _cache.append(doc["name"])
        return _cache
