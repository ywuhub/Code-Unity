from typing import cast

from bson import ObjectId
from bson.errors import InvalidId
from flask_jwt_extended import current_user, jwt_required
from flask_restful import Resource
from flask_restful.reqparse import RequestParser

from server.exceptions import (
    AlreadyMemberOf,
    ProjectFull,
    ProjectNotFound,
    UserNotFound,
    UserNotInvolved,
    NotProjectLeader,
    CannotKickYourself
)
from server.managers.project_manager import ProjectManager
from server.models.project import Project, project_fields
from server.models.user import User
from server.utils.json import marshal


class ProjectResource(Resource):
    def __init__(self, project_manager: ProjectManager):
        self.project_manager = project_manager

    def get(self, project_id: str):
        """
        Gets information about a specific project given its project_id. Returns 422 if
        the project_id is not in the correct format. 404 if project_id is not found.

        Example:
        ```
        GET /api/project/5dac029b8b819e584ff36f8d ->
        (200 OK) <-
            {
                "title": "Code Unity",
                "leader": "5dabfe830ddd57902efd2fa3",
                "max_people": 5,
                "cur_people": 1,
                "members": [
                    "5dabfe830ddd57902efd2fa3"
                ],
                "description": "Nice.",
                "course": "4920",
                "technologies": [
                    "assembly",
    projects              "python",
                    "mongoDB",
                    "react"
                ],
                "languages": [
                    "chinese",
                    "english"
                ],
                "tags": [
                    "wam booster",
                    "free hd",
                    "machine learning",
                    "blockchain"
                ]
            }
        # If project not found
        GET /api//project/ffffffffffffffffffffffff ->
        (404 NOT FOUND) <-
            {
                "message": "project_id ffffffffffffffffffffffff not found"
            }
        # If project_id isn't in the right format
        GET /api//project/ohno ->
        (422 UNPROCESSABLE ENTITY) <-
            {
                "message": "invalid project_id: ohno"
            }
        ```
        """
        try:
            id = ObjectId(project_id)
        except InvalidId:
            return {"message": f"invalid project_id: {project_id}"}, 422

        doc = self.project_manager.get_project(id)
        if doc is None:
            return {"message": f"project_id {project_id} not found"}, 404
        return marshal(doc, project_fields)

    @jwt_required
    def put(self, project_id: str):
        """
        Updates a project that is owned by the logged in user by replacing it
        with the data passed in. Returns 422 if the project_id is invalid, 404 if
        the project_id is not found, and 401 if the logged in user does not own
        the specified project.

        Expects the JSON format:
        {
            "title": "",
            "max_people": ,
            "course": "",
            "description": "",
            "tags": [],
            "technologies": [ ], # programming languages
            "languages": []
        }

        But all parameters are optional.
        """
        try:
            id = ObjectId(project_id)
        except InvalidId:
            return {"message": f"invalid project_id: {project_id}"}, 422

        project = self.project_manager.get_project(id)

        if project is None:
            return {"message": f"project_id {project_id} not found"}, 404
        if current_user._id != project["leader"]["_id"]:
            return {"message": "only the owner may modify a project"}, 401
        
        # Parse arguments
        parser = RequestParser(bundle_errors=True)
        parser.add_argument("title", store_missing=False)
        parser.add_argument("max_people", type=int, store_missing=False)
        parser.add_argument("course", store_missing=False)
        parser.add_argument("description", store_missing=False)
        parser.add_argument("tags", action="append", store_missing=False)
        parser.add_argument("technologies", action="append", store_missing=False)
        parser.add_argument("languages", action="append", store_missing=False)
        project_details = parser.parse_args(strict=True)

        # When parameters are parsed back so no blank fields
        if project_details:
            # check if new max_people is greater than the current amount of members
            if 'max_people' in project_details.keys():
                if (project_details['max_people'] < project["cur_people"]):
                    return {"message": "new maximum number of members value is less than current amount of members"}

            # update details in project mamanger
            self.project_manager.update_project(project, project_details)
        
        return {"message": "successfully updated project"}

    @jwt_required
    def delete(self, project_id: str):
        """
        Deletes a project that is owned by the logged in user. Returns 422 if the
        project_id is invalid, 404 if the project_id is not found, and 401 if the
        logged in user does not own the specified project.
        """
        try:
            id = ObjectId(project_id)
        except InvalidId:
            return {"message": f"invalid project_id: {project_id}"}, 422

        project = self.project_manager.get_project(id)

        if project is None:
            return {"message": f"project_id {project_id} not found"}, 404
        if current_user._id != project.leader:
            return {"message": "only the owner may delete a project"}, 401

        self.project_manager.delete_project(project._id)
        return {"message": "successfully deleted the project"}


class ProjectJoin(Resource):
    def __init__(self, project_manager: ProjectManager):
        self.project_manager = project_manager

    @jwt_required
    def post(self, project_id: str):
        """
        Allows a user to accept a pending invitation to join a project, or by a
        project leader to accept another user's request to join their project.
        This consumes the pending invitation and/or pending request.

        Expects:
        ```
        {
            "join_from": string,  # "request" or "invitation", required

            # if the purpose is to allow a project leader to accept a request,
            # then the "user_id" field must be passed in to denote what user the
            # leader is accepting into the project.
            "user_id": string
        }
        ```

        Examples:
        ```
        # To accept an invitation to join a project.
        POST ->
        {
            "join_from": "invitation"
        }
        # If the user has an invitation for the project.
        (200 OK) <-

        # To accept an incoming request from a user.
        POST ->
        {
            "join_from": "request",
            "user_id": "5daa6efd8805c462ef0d16e1"
        }
        (200 OK) <-
        ```
        """
        parser = RequestParser()
        parser.add_argument("join_from", required=True)
        parser.add_argument("user_id")
        args = parser.parse_args(strict=True)

        if args["join_from"] not in ("request", "invitation"):
            return {"message": "join_from must be 'request' or 'invitation'"}, 400

        try:
            project = ObjectId(project_id)
        except InvalidId:
            return {"message": "invalid project_id"}, 422

        if args["join_from"] == "request":
            if args["user_id"] is None:
                return {"message": "'user_id' field required for 'request' type"}, 400
            try:
                user = ObjectId(args["user_id"])
            except InvalidId:
                return {"message": "invalid user_id"}, 422
            # verification of request
            if not self.project_manager.is_request_exist(user, project):
                return {"message": "request does not exist"}, 404
        else:
            user = current_user._id
            # verification of invitation
            if not self.project_manager.is_invitation_exist(user, project):
                return {"message": "invitation does not exist"}, 404

        try:
            self.project_manager.add_user_to_project(user, project)
        except ProjectNotFound:
            return {"message": "project not found"}, 404
        except UserNotFound:
            return {"message": "user not found"}, 404
        except AlreadyMemberOf:
            return {"message": "already a member"}, 400
        except ProjectFull:
            return {"message": "project is already full"}, 400
        finally:
            # Consume the invitation/request
            self.project_manager.remove_invitation_request(user, project)

        return {"status": "success"}


class ProjectLeave(Resource):
    def __init__(self, project_manager: ProjectManager):
        self.project_manager = project_manager

    @jwt_required
    def post(self, project_id: str):
        """
        Removes the logged in user from the specified project. If the user is the
        leader of the project, the project is subsequently disbanded.
        """
        user = cast(User, current_user)
        try:
            project_id = ObjectId(project_id)
        except InvalidId:
            return {"message": "invalid project_id"}, 422

        try:
            user.leave_project(self.project_manager, project_id)
        except ProjectNotFound:
            return {"message": "project not found"}, 404
        except UserNotFound:
            return {"message": "cannot leave group that user is not part of"}, 400

        return {"status": "success"}

class ProjectKick(Resource):
    def __init__(self, project_manager: ProjectManager):
        self.project_manager = project_manager
    
    @jwt_required
    def post(self, project_id: str):
        """
        Kicks the selected user from the project by the group leader.
        """
        user = cast(User, current_user)
        try:
            project_id = ObjectId(project_id)
        except InvalidId:
            return {"message": "invalid project_id"}, 422
        
        # fetch the member id to kick
        parser = RequestParser()
        parser.add_argument("user_id", required=True)
        args = parser.parse_args(strict=True)
        
        # check if incoming user_id is valid
        try:
            kick_id = ObjectId(args["user_id"])
        except:
            return {"message": "user_id is not a valid ObjectId"}, 400
       
        # remove user from project if possible
        try: 
            self.project_manager.kick_user_from_project(kick_id, user._id, project_id)
        except ProjectNotFound:
            return {"message": "project not found"}, 404
        except UserNotFound:
            return {"message": "user does not exist"}, 404
        except UserNotInvolved:
            return {"message": "user not involved in project"}, 400
        except NotProjectLeader:
            return {"message": "current user is not the project leader so not kicking rights"}, 400
        except CannotKickYourself:
            return {"message": "cannot kick yourself"}, 400
            
        return {"status": "user is successfully kicked"}