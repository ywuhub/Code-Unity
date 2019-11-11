from typing import cast

from bson import ObjectId
from bson.errors import InvalidId
from flask_jwt_extended import current_user, jwt_required
from flask_restful import Resource
from flask_restful.reqparse import RequestParser
from pymongo.errors import DuplicateKeyError

from server.exceptions import (
    AlreadyMemberOf,
    DocumentNotFound,
    ProjectFull,
    ProjectNotFound,
    UserNotFound,
)
from server.models.user import User


class UserInvite(Resource):
    @jwt_required
    def post(self, uid: str):
        """
        Invite a user to join a group. The user will have to accept the invitation
        before they are actually considered part of the group.

        Expects:
        ```
        {
            "project_id": string  # required
        }
        ```

        Examples:
        ```
        POST ->
        (200 OK) <-
        ```
        """
        user = cast(User, current_user)
        parser = RequestParser()
        parser.add_argument("project_id", required=True)
        args = parser.parse_args(strict=True)

        try:
            invited_user = ObjectId(uid)
        except InvalidId:
            return {"message": "invalid uid"}, 422
        try:
            project_id = ObjectId(args["project_id"])
        except InvalidId:
            return {"message": "invalid project_id"}, 422

        try:
            user.invite_to_project(invited_user, project_id)
        except ProjectNotFound:
            return {"message": "project not found"}, 400
        except UserNotFound:
            return {"message": "user not found"}, 404
        except PermissionError:
            return {"message": "only the project leader may invite"}, 401
        except AlreadyMemberOf:
            return {"message": "user is already in the group"}, 400
        except ProjectFull:
            return {"message": "project is full"}, 400
        except DuplicateKeyError:
            return {"message": "invitation already pending"}, 400

        return {"status": "success"}

    @jwt_required
    def delete(self, uid: str):
        """
        Removes an invitation that was sent to a user.

        Expects:
        ```
        {
            "project_id": string,  # required
        }
        ```
        """
        user = cast(User, current_user)
        parser = RequestParser()
        parser.add_argument("project_id", required=True)
        args = parser.parse_args(strict=True)

        try:
            invited_user = ObjectId(uid)
        except InvalidId:
            return {"message": "invalid uid"}, 422
        try:
            project_id = ObjectId(args["project_id"])
        except InvalidId:
            return {"message": "invalid project_id"}, 422

        try:
            user.delete_invitation(invited_user, project_id)
        except ProjectNotFound:
            return {"message": "project not found"}, 400
        except PermissionError:
            return {"message": "only the project leader may delete invites"}, 401
        except DocumentNotFound:
            return {"message": "invitation does not exist"}, 404

        return {"status": "success"}
