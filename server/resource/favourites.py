from bson import ObjectId
from copy import deepcopy
from bson.json_util import dumps

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

        # set up return json data
        ret = {
            "_id": "",
            "user_id": "",
            "favourite_projects": []
        }

        # convert user_id (string) into ObjectId
        try:
            user_id = ObjectId(user_id)
        except:
            return {"message": "invalid user id"}, 400

        # fetch the favourites list of the user
        if 'user_id' in args.keys():
            # check if user is in the database
            user = self.users.find_one({"_id": user_id})
            if user is None:
                return {"message": "user not found"}, 404
            else:
                # check if user has any favourites
                user_favourites = self.favourites.find_one({"user_id": user_id})
                if user_favourites is None:
                    return {"message": "user does not have any favourites"}, 400  
                else:
                    # add return _id and user_id data
                    ret["_id"] = str(user_favourites["_id"])
                    ret["user_id"] = str(user_favourites["user_id"])

                    # update project details if needed
                    update_project_details = []
                    for project in user_favourites["favourite_projects"]:
                        project_id = str(project["_id"])
                        project_id = ObjectId(project_id)

                        doc = self.projects.find_one({"_id": project_id})
                        if doc:
                            update_project_details.append(deepcopy(doc))

                            # ret details
                            ret_members = []
                            for member_id in doc["members"]:
                                mem = self.users.find_one({"_id": member_id})
                                mem_dict = {"_id": str(member_id), "username": mem["username"]}
                                ret_members.append(mem_dict)

                            ret_project = {
                                "project_id": str(doc["_id"]),
                                "title": doc["title"],
                                "leader": str(doc["leader"]),
                                "max_people": doc["max_people"],
                                "cur_people": doc["cur_people"],
                                "members": ret_members,
                                "description": doc["description"],
                                "course": doc["course"],
                                "technologies": doc["technologies"],
                                "languages": doc["languages"],
                                "tags": doc["tags"]
                            }
                            ret["favourite_projects"].append(ret_project)
                    
                    new_favourites = {"favourite_projects": update_project_details}
                    self.favourites.update({"user_id": user_id}, {"$set": new_favourites}, upsert=False)
                
                return ret, 200    
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
        if ('user_id' or 'project_id') not in args.keys():
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
                    favourites_list.append(deepcopy(project)) 
                    self.favourites.insert({
                        "user_id": user_id,
                        "favourite_projects": favourites_list
                    })
                else:
                    new_favourite_list = user_favourites["favourite_projects"]

                    # check if this project is already in the user's favourites
                    for proj in new_favourite_list:
                        if proj["_id"] == project_id:
                            return {"message": "project is already in the favourites list"}, 400

                    new_favourite_list.append(deepcopy(project))
                    updated_list = {"favourite_projects": new_favourite_list}

                    self.favourites.update({"user_id": user_id}, {"$set": updated_list}, upsert=False)
            
            return {"status": "project has been added to favourites successfully"}, 200
    
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
        # fetch parameter
        get_parser = reqparse.RequestParser(bundle_errors=True)
        get_parser.add_argument("user_id", required=True, help="User ID required to acccess the user's favourite projects")
        get_parser.add_argument("project_id", required=True, help="Project ID required to remove a project")
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
        if ('user_id' or 'project_id') not in args.keys():
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
                # remove project from the user's favourites
                user_favourites = self.favourites.find_one({"user_id": user_id})
                if user_favourites is None:
                    return {"message": "user does not have any favourite projects"}, 400
                else:
                    new_favourite_list = user_favourites["favourite_projects"]

                    # try to remove the project if it is in the favourites
                    try:
                        new_favourite_list.remove(project)
                    except:
                        return {"message": "the project is not in the favourites list"}, 400

                    if new_favourite_list is None:
                        new_favourite_list = []

                    updated_list = {"favourite_projects": new_favourite_list}
                    self.favourites.update({"user_id": user_id}, {"$set": updated_list}, upsert=False)
            
            return {"status": "project has be removed from favourites successfully"}, 200