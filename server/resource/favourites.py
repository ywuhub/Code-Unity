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
        Input (url parameters):
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
        user_id = args["user_id"]

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
    
    def post(self):
        """
        Add the selected project to the user's favourites list
        Input (url parameters):
        - user_id: string
        description: the user id for the project to be added to their favourites
        - project_id: string
        description: the project id to be added to the user's favourites
        
        EXAMPLE:
        POST api/favourites ->
            (200 OK) <-
                {
                    "message": "project added to the user's favourites"
                }
        """
        # fetch parameter
        get_parser = reqparse.RequestParser(bundle_errors=True)
        get_parser.add_argument("user_id", required=True, help="User ID required to ad to their favourite projects")
        get_parser.add_argument("project_id", required=True, help="Project ID required to add to the favourite projects")
        args = get_parser.parse_args(strict=True)

        # get user_id and project_id
        user_id = args["user_id"]
        project_id = args["project_id"]

        # convert parameter ids into objectids
        try:
            user_id = ObjectId(user_id)
            project_id = ObjectId(project_id)
        except:
            return {"message": "invalid user id or project id"}, 400

        # add project to the user's favourites
        if 'user_id' or 'project_id' not in args:
            return {"message": "both user and project id are required"}, 400
        else:
            # check if user is valid
            user = self.users.find_one({"_id": user_id})
            project = self.projects.find_one({"_id": project_id})
            if user is None:
                return {"message": "user not found"}, 404
            elif project is None:
                return {"message": "project not found"}, 404
            else:
                # add project to favourites
                user_favourites = self.favourites.find_one({"user_id": user_id})
                if user_favourites is None:
                    # insert a new doc into favourites collection
                    favourites_list = []
                    self.favourites.insert({
                        "user_id": user_id,
                        "favourite_projects": favourites_list.append(project)
                    })
                else:
                    new_favourite_list = user_favourites["favourite_projects"].append(project)
                    updated_list = {"favourite_projects": new_favourite_list}
                    self.favourites.update({"user_id": user_id}, {"set": updated_list}, upsert=False)
            
            return {"status": "project has be added to favourites successfully"}, 200
    
    def put(self):
        """
        Remove the selected project from the user's favourites list
        Input (url parameters):
            - user_id: string
            description: the user id for the project to be removed to their favourites
            - project_id: string
            description: the project id to be removed to the user's favourites
            
            EXAMPLE:
            PUT api/favourites ->
                (200 OK) <-
                    {
                        "message": "project removed from the user's favourites"
                    }
        """
        
        pass