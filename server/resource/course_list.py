from flask_restful import Resource
from pymongo.database import Database

_cache = []


class CourseList(Resource):
    def __init__(self, db: Database):
        self.db = db

    def get(self):
        """
        Lists all the COMP courses available in UNSW.
        ```json
        [
            {
                "code": string,
                "name": string,
            }
        ]
        ```

        Example:
        ```
        GET ->
        (200 OK) <-
            [
                {
                    "code": "COMP1000",
                    "name": "Introduction to World Wide Web, Spreadsheets and Databases"
                },
                {
                    "code": "COMP1400",
                    "name": "Programming for Designers"
                }
            ]
        ```
        """
        # fetch the COMP courses from the database
        if len(_cache) == 0:
            for doc in self.db["comp_courses"].find({}).sort("code", 1):
                _cache.append({"code": doc["code"], "name": doc["name"]})
        return _cache
