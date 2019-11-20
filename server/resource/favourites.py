from bson import ObjectId

from flask_restful import Resource, reqparse

from pymongo.database import Database

class FavouriteProjects(Resource):
    def __init__(self, db: Database):
        self.favourites = db.get_collection("favourites")
        self.users = db.get_collection("users")
        self.projects = db.get_collection("projects")

    def get(self):
        """
        Fetch the list of favourited projects for the currently logged in user
        Input:
        - user_id: string
          description: the user id from the parameters to fetch their favourite projects

        EXAMPLE:
        ```
        GET api/favourites ->
            (200 OK) <-
                {
                    "user_id": user_id \\ the member id for which this list of favourite projects belongs to
                    "favourite_projects": [ \\ list of projects and its details that is favourites of the user
                                { 
                                    "title": str,
                                    "leader": str,
                                    "max_people": int,
                                    "cur_people": int,
                                    "members": [],
                                    "description": str,
                                    "course": str,
                                    "technologies": [],
                                    "languages": [],
                                    "tags": []
                                },
                    ]
                }
        ```
        """
        # fetch parameter
        get_parser = reqparse.RequestParser(bundle_errors=True)
        get_parser.add_argument("user_id", required=True, help="User ID required to fetch favourite projects")
        args = get_parser.parse_args(strict=True)

        # get user_id
        user_id = args["userid"]

        # convert user_id (string) into ObjectId
        try:
            user_id = ObjectId(user_id)
        except:
            return {"message": "invalid user id"}, 400

        # fetch the favourites list of the user
        if 'user_id' in args:
            # check if user is in the database
            user = self.users.find({"_id": user_id})
            if user is None:
                return {"message": "user not found"}, 404
            else:
                # check if user has any favourites
                user_favourites = self.favourites({"user_id": user_id})
                if user_favourites is None:
                    return {"message": "user does not have any favourites"}, 400  
                else:
                    return user_favourites, 200    
        else:
            return {"message": "user id required to fetch the favourites list"}, 400
    """
    Add the selected project to the user's favourites list
    """    
    def post(self):
        pass
    
    """
    Remove the selected project from the user's favourites list
    """
    def put(self):
        pass