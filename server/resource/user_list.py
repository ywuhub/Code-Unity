from flask_restful import Resource
from pymongo.database import Database

class UserList(Resource):
    def __init__(self, db: Database):
        self.db = db

    def get(self):
        """
        Get a list of all usernames in the database private users are removed.
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
        # fetch the usernames and emails
        user_list = []
        for doc in self.db["users"].find({}, {"password": 0}):
            user_list.append({
                                "_id": str(doc["_id"]), 
                                "username": doc["username"], 
                                "email": doc["email"]
                            })

        # remove any users with private profile from public lists
        private_list = []
        for doc in self.db["profiles"].find({"visibility": "private"}, {"_id": 1}):
            private_list.append(str(doc["_id"])) 

        # filter out private users
        ret = [user for user in user_list if user['_id'] not in private_list]   
        return ret