from typing import List

from pymongo.database import Database

from server.exceptions import DocumentNotFound
from server.utils.json import ObjectId


class NotificationManager:
    def __init__(self, db: Database):
        self.db = db.get_collection("notifications")

    def list_notifications(self, user: ObjectId):
        self.db.find({"user": user})

    def dismiss_notification(self, user: ObjectId, nid: ObjectId):
        res = self.db.delete_one({"_id": nid, "user": user})
        if res.deleted_count == 0:
            raise DocumentNotFound

    def dismiss_all_notifications(self, user: ObjectId):
        self.db.delete_many({"user": user})

    def notify_received_invite(
        self, user: ObjectId, project_title: str, project_id: ObjectId
    ):
        """
        user received invite to join project
        """
        self.db.insert_one(
            {
                "user": user,
                "type": "invite",
                "project_title": project_title,
                "project_id": project_id,
            }
        )

    def notify_request_to_join(
        self,
        leader: ObjectId,
        user: ObjectId,
        username: str,
        project_title: str,
        project_id: ObjectId,
    ):
        """
        leader received request to join project
        """
        self.db.insert_one(
            {
                "user": leader,
                "type": "request",
                "project_title": project_title,
                "project_id": project_id,
                "requester": {"username": username, "id": user},
            }
        )

    def notify_user_joined_project(
        self,
        user: ObjectId,
        username: str,
        project_title: str,
        project_id: ObjectId,
        users: List[ObjectId],  # list of users to notify
    ):
        """
        user joined project
        """
        self.db.insert_many(
            [
                {
                    "user": member,
                    "type": "join",
                    "project_title": project_title,
                    "project_id": project_id,
                    "joined_user": {"username": username, "id": user},
                }
                for member in users
            ]
        )

    def notify_user_left_project(
        self,
        user: ObjectId,
        username: str,
        project_title: str,
        project_id: ObjectId,
        users: List[ObjectId],
    ):
        """
        user left project
        """
        self.db.insert_many(
            [
                {
                    "user": member,
                    "type": "leave",
                    "project_title": project_title,
                    "project_id": project_id,
                    "left_user": {"username": username, "id": user},
                }
                for member in users
            ]
        )

    def notify_user_kicked(
        self,
        user: ObjectId,
        username: str,
        project_title: str,
        project_id: ObjectId,
        users: List[ObjectId],
    ):
        """
        user kicked from project
        """
        self.db.insert_many(
            [
                {
                    "user": member,
                    "type": "kick",
                    "project_title": project_title,
                    "project_id": project_id,
                    "kicked_user": {"username": username, "id": user},
                }
                for member in users
            ]
        )

    def notify_project_deleted(self, project_title: str, users: List[ObjectId]):
        """
        project deleted
        """
        self.db.insert_many(
            [
                {
                    "user": member,
                    "type": "project_delete",
                    "project_title": project_title,
                }
                for member in users
            ]
        )
