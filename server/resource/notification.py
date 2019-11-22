import json
from typing import cast
from flask import make_response

from bson import ObjectId, json_util
from bson.errors import InvalidId
from flask_jwt_extended import current_user, jwt_required
from flask_restful import Resource
from flask_restful.reqparse import RequestParser

from server.exceptions import DocumentNotFound
from server.managers.notification_manager import NotificationManager
from server.models.user import User


class NotificationResource(Resource):
    def __init__(self, nm: NotificationManager):
        self.nm = nm

    @jwt_required
    def get(self):
        """
        Returns a list of notification objects for the current logged in user.
        There are several types of notifications, namely:
        - invite: when a user receives an invite to join a project
        - request: when a leader receives a request to join a project
        - join: sent to all members when a user joins a project
        - leave: sent to all members when a user leaves a project
        - kick: sent to all members when a user is kicked from a project
        - project_delete: sent to all members when a project is deleted
    
        All types of notifications have these fields:
        ```
        {
            "datetime": number,  # ms since epoch
            "type": str,         # one of the types of notifications described above
        }
        ```

        Additional `invite` fields:
        ```
        {
            "project_title": str,
            "project_id": str
        }
        ```

        Additional `request` fields:
        ```
        {
            "project_title":  str,
            "project_id": str,
            "requester": {
                "username": str,
                "id": str
            }
        }
        ```

        Additional `join` fields:
        ```
        {
            "project_title": str,
            "project_id": str,
            "joined_user": {
                "username": str,
                "id": str
            }
        }
        ```

        Additional `leave` fields:
        ```
        {
            "project_title": str,
            "project_id": str,
            "left_user": {
                "username": str,
                "id": str
            }
        }
        ```

        Additional `kick` fields:
        ```
        {
            "project_title": str,
            "project_id": str,
            "kicked_user": {
                "username": str,
                "id": str
            }
        }
        ```

        Additional `project_delete` fields:
        ```
        {
            "project_title": str
        }
        ```
        """
        cur_user = cast(User, current_user)

        # Manually creating a response to bypass flask-restful
        res = make_response(
            json.dumps(
                self.nm.list_notifications(cur_user._id), default=json_util.default
            )
        )
        res.headers["content-type"] = "application/json"
        return res

    @jwt_required
    def delete(self):
        """
        Dismisses 1 notification, or all of them. Will return a 404 if the specified
        notification ID is not found.
        
        Expects:
        ```
        {
            "notification": str,  # either the notification id, or the string "all"
        }
        ```
        """
        parser = RequestParser()
        parser.add_argument("notification", required=True)
        args = parser.parse_args(strict=True)

        cur_user = cast(User, current_user)

        if args["notification"] == "all":
            self.nm.dismiss_all_notifications(cur_user._id)
            return {"status": "success"}

        try:
            nid = ObjectId(args["notification"])
        except InvalidId:
            return {"message": "invalid notification id"}, 400

        try:
            self.nm.dismiss_notification(cur_user._id, nid)
        except DocumentNotFound:
            return {"message": "notification not found"}, 404

        return {"status": "success"}
