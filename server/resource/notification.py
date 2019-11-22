from typing import cast

from bson.errors import InvalidId
from flask_jwt_extended import current_user, jwt_required
from flask_restful import Resource
from flask_restful.reqparse import RequestParser

from server.exceptions import DocumentNotFound
from server.managers.notification_manager import NotificationManager
from server.models.user import User
from server.utils.json import ObjectId


class NotificationResource(Resource):
    def __init__(self, nm: NotificationManager):
        self.nm = nm

    @jwt_required
    def get(self):
        """
        Gets a list of all notifications for the current logged in user.
        """
        cur_user = cast(User, current_user)
        self.nm.list_notifications(cur_user._id)

    @jwt_required
    def delete(self):
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
