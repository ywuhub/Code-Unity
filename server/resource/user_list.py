from bson import ObjectId
from flask import request
from flask_restful import Resource
from pymongo.database import Database


class UserList(Resource):
    def __init__(self, db: Database):
        self.db = db

    def get(self):
        """
        Get a list of all usernames in the database private users are removed.
        Optional parameter: fetch a list of specific usernames from a list of memberids
        INPUT:
        - user_ids: list of member ids
        OUTPUT:
        - usernames_list: list of usernames in same order of member ids
        
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

        If Optional Parameter Given:
        ```
         ```json
        [
            {
                "_id": string,
                "username": string,
            }
        ]
        ```

        GET ->
        (200 OK) <-
            [
                {
                    "_id": "5daa6efd8805c462ef0d16e1",
                    "username": "testuser",
                },
                {
                    "_id": "5daa6efd5647c462ef0d16f3",
                    "username": "testuser1",
                }
            ]
        ```
        """

        # init return list
        ret = []

        # get parameter of the list of user ids from get request
        user_ids = request.args.getlist("user_ids")

        # if not optional parameter if user_ids then fetch entire user list
        if (len(user_ids) == 0):
            # fetch the usernames and emails
            user_list = []
            for doc in self.db["users"].find({}, {"password": 0}):
                if (len(doc) < 3):
                    continue
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
        else:
            # fetch usernames only for the optional parameter that contains member ids
            user_ids = [ObjectId(user_id) for user_id in user_ids]
            for doc in self.db["users"].find({"_id": {"$in": user_ids} }):
                ret.append({
                    "_id": str(doc["_id"]),
                    "username": doc["username"]
                })

        return ret