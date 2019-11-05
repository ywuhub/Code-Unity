from flask_restful import Resource
from pymongo.database import Database

_cache = []

class UserList(Resource):
    def __init__(self, db: Database):
        self.db = db

    def get(self):
        """
        Get a list of all usernames in the database.
        ```json
        [
            {
                "_id": string,
                "username": string,
                "email": string
            }
        ]
        ```

        Example:
        ```
        GET ->
        (200 OK) <-
            [
                {
                    "_id": "5daa6efd8805c462ef0d16e1",
                    "username": "testuser",
                    "email": "test@user.com"
                },
                {
                    "_id": "5daa6efd5647c462ef0d16f3",
                    "username": "testuser1",
                    "email": "test1@user.com"
                }
            ]
        ```
        """
        if len(_cache) == 0:
            for doc in self.db["users"].find({}, {"password": 0}):
                _cache.append({
                               "_id": str(doc["_id"]), 
                               "username": doc["username"], 
                               "email": doc["email"]
                             })
        return _cache