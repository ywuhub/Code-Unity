from copy import deepcopy
from typing import Any, Dict, List

from bson import ObjectId
from flask_restful import fields
from pymongo.database import Database

from server.exceptions import (
    AlreadyMemberOf,
    DocumentNotFound,
    ProjectFull,
    ProjectNotFound,
    UserNotFound,
)
from server.managers.project_manager import ProjectManager
from server.models.project import Project
from server.utils.json import ObjectId as ObjectIdMarshaller

profile_fields = {
    "_id": ObjectIdMarshaller,
    "username": fields.String(default=None),
    "name": fields.String(default=None),
    "email": fields.String(),
    "visibility": fields.String,
    "description": fields.String(default=None),
    "interests": fields.List(fields.String, default=None),
    "programming_languages": fields.List(fields.String, default=None),
    "languages": fields.List(fields.String, default=None),
    "github": fields.String(default=None),
}

account_fields = {
    "_id": ObjectIdMarshaller,
    "username": fields.String(default=None),
    "email": fields.String(default=None),
    "avatar": fields.String(default=None)
}

class Profile:
    _id: ObjectId
    name: str
    email: str
    visibility: bool
    description: str
    interest: List[str]
    programming: List[str]
    languages: List[str]
    github: str

    profile_fields = frozenset(
        (
            "_id",
            "name",
            "email",
            "visibility",
            "description",
            "interests",
            "programming_languages",
            "languages",
            "github",
        )
    )

    def __init__(self, **kwargs):
        for k, v in kwargs.items():
            if k not in Profile.profile_fields:
                continue
            setattr(self, k, v)

    def to_dict(self):
        d: Dict[str, Any] = {}

        for k, v in self.__dict__.items():
            if k not in Profile.profile_fields:
                continue
            d[k] = v

        return d

    @staticmethod
    def from_dict(d: Dict[str, Any]):
        return Profile(**d)


class Account:
    _id: ObjectId
    username: str
    email: str
    avatar: str

    account_fields = frozenset(
        (
            "_id",
            "username",
            "email",
            "avatar"
        )
    )

    def __init__(self, **kwargs):
        for k, v in kwargs.items():
            if k not in Account.account_fields:
                continue
            setattr(self, k, v)

    def to_dict(self):
        d: Dict[str, Any] = {}

        for k, v in self.__dict__.items():
            if k not in Account.account_fields:
                continue
            d[k] = v

        return d

    @staticmethod
    def from_dict(d: Dict[str, Any]):
        return Account(**d)


class User:
    _id: ObjectId

    def __init__(self, id: ObjectId, db: Database):
        self._id = id
        self.db = db
        self.profiles = db.get_collection("profiles")
        self.projects = db.get_collection("projects")
        self.accounts = db.get_collection("users")

    def create_project(self, title: str, max_people: int, **kwargs):
        new_project = Project(self._id, title, max_people, **kwargs)
        return self.projects.insert_one(new_project.to_dict()).inserted_id

    @property
    def profile(self) -> Profile:
        ret = self.profiles.find_one({"_id": self._id})

        if ret is None:
            return Profile()

        return Profile.from_dict(ret)

    @property
    def account(self) -> Account:
        ret = self.accounts.find_one({"_id": self._id})

        if ret is None:
            return Account()

        return Account.from_dict(ret)

    def update_profile(self, profile: Dict):
        """
        Replace the user's current profile or creates it if it does not exist.
        """
        self.profiles.replace_one({"_id": self._id}, profile, upsert=True)

    def update_account(self, account: Dict):
        """
        Replace the user's current account information with an update on either
        the username or password being updated.
        """
        if account:
            # check if new username is already taken in the database
            if 'username' in account.keys():
                doc = self.accounts.find_one({"username": account['username']}, {"_id": 1, "username": 1})
                
                # if duplicate username is found return error depending on if 
                # its the current user's one or other users
                if doc:
                    if doc['_id'] == self._id:
                        return {"error": "cannot change to your current username"}
                    else:
                        return {"error": "username already taken!"}

            self.accounts.update({"_id": self._id}, {"$set": account}, upsert=False)
        
        return {"status": "success"}

    def update_avatar(self, avatar_url: str):
        """
        Updates the user's avatar picture
        """
        self.accounts.update({"_id": self._id}, {"$set": {"avatar": avatar_url}}, upsert=True)
        return "successfully updated avatar"

    def apply_to_project(self, project_id: ObjectId, message: str):
        project = self.projects.find_one({"_id": project_id})
        if project is None:
            raise ProjectNotFound()

        # Check if the user isn't already a member or if the project is already full
        project = Project.from_dict(project)
        if self._id in project.members:
            raise AlreadyMemberOf()
        if project.max_people == project.cur_people:
            raise ProjectFull()

        doc = {"project_id": project_id, "user_id": self._id}
        if message is not None:
            doc["message"] = message

        # May raise DuplicateKeyError if the user_id, project_id pair already exists
        # in the collection.
        requests = self.db.get_collection("join_requests")
        requests.insert_one(doc)

    def delete_project_application(self, project_id: ObjectId):
        requests = self.db.get_collection("join_requests")

        result = requests.delete_one({"project_id": project_id, "user_id": self._id})
        if result.deleted_count == 0:
            raise ProjectNotFound()

    def get_outgoing_join_requests(self):
        pipeline = [
            {"$match": {"user_id": self._id}},
            {
                "$lookup": {
                    "from": "projects",
                    "localField": "project_id",
                    "foreignField": "_id",
                    "as": "project",
                }
            },
            # The $lookup stage causes every project that matches the project_id
            # to be included as an array in the project field, thus we unwind it
            # to maintain a sane structure.
            {"$unwind": "$project"},
            {
                "$project": {
                    "project_id": 1,
                    "project_title": "$project.title",
                    "message": 1,
                }
            },
        ]

        result = []
        requests = self.db.get_collection("join_requests")
        for doc in requests.aggregate(pipeline):
            result.append(doc)

        return result

    def get_incoming_join_requests(self):
        pipeline = [
            {
                "$lookup": {
                    "from": "projects",
                    "localField": "project_id",
                    "foreignField": "_id",
                    "as": "project",
                }
            },
            {
                "$lookup": {
                    "from": "users",
                    "localField": "user_id",
                    "foreignField": "_id",
                    "as": "user",
                }
            },
            {"$unwind": "$project"},
            {"$unwind": "$user"},
            {"$match": {"project.leader": self._id}},
            {
                "$project": {
                    "project_id": 1,
                    "project_title": "$project.title",
                    "user_id": 1,
                    "user_name": "$user.username",
                    "message": 1,
                }
            },
        ]

        result = []
        requests = self.db.get_collection("join_requests")
        for doc in requests.aggregate(pipeline):
            result.append(doc)
        return result

    def invite_to_project(self, user_id: ObjectId, project_id: ObjectId):
        projects = self.db.get_collection("projects")
        project = projects.find_one({"_id": project_id})
        if project is None:
            raise ProjectNotFound()

        users = self.db.get_collection("users")
        user = users.find_one({"_id": user_id})
        if user is None:
            raise UserNotFound()

        # Check if we're the leader of the project that we're trying to invite
        # people into.
        if project["leader"] != self._id:
            raise PermissionError()

        # Check if the invited user is already a member of the group
        if user_id in project["members"]:
            raise AlreadyMemberOf()

        if len(project["members"]) == project["max_people"]:
            raise ProjectFull()

        invitations = self.db.get_collection("invitations")
        invitations.insert_one(
            {"project_id": project_id, "user_id": user_id, "leader_id": self._id}
        )

    def delete_invitation(self, user_id: ObjectId, project_id: ObjectId):
        # Check if the user has permissions to delete invitations
        projects = self.db.get_collection("projects")
        project = projects.find_one({"_id": project_id})
        if project is None:
            raise ProjectNotFound()
        if project["leader"] != self._id:
            raise PermissionError()

        invitations = self.db.get_collection("invitations")
        n_deleted = invitations.delete_one(
            {"project_id": project_id, "user_id": user_id}
        ).deleted_count

        # If the delete_one operation didn't delete anything, the invitation
        # didn't exist in the first place.
        if n_deleted != 1:
            raise DocumentNotFound()

    def get_outgoing_invitations(self):
        pipeline = [
            {"$match": {"leader_id": self._id}},
            {
                "$lookup": {
                    "from": "projects",
                    "localField": "project_id",
                    "foreignField": "_id",
                    "as": "project",
                }
            },
            {
                "$lookup": {
                    "from": "users",
                    "localField": "user_id",
                    "foreignField": "_id",
                    "as": "user",
                }
            },
            {"$unwind": "$project"},
            {"$unwind": "$user"},
            {
                "$project": {
                    "project_id": 1,
                    "project_title": "$project.title",
                    "user_id": 1,
                    "user_name": "$user.username",
                }
            },
        ]

        res = []
        invitations = self.db.get_collection("invitations")
        for doc in invitations.aggregate(pipeline):
            res.append(doc)

        return res

    def get_incoming_invitations(self):
        pipeline = [
            {"$match": {"user_id": self._id}},
            {
                "$lookup": {
                    "from": "projects",
                    "localField": "project_id",
                    "foreignField": "_id",
                    "as": "project",
                }
            },
            {
                "$lookup": {
                    "from": "users",
                    "localField": "leader_id",
                    "foreignField": "_id",
                    "as": "user",
                }
            },
            {"$unwind": "$project"},
            {"$unwind": "$user"},
            {
                "$project": {
                    "project_id": 1,
                    "project_title": "$project.title",
                    "user_id": 1,
                    "user_name": "$user.username",
                }
            },
        ]

        res = []
        invitations = self.db.get_collection("invitations")
        for doc in invitations.aggregate(pipeline):
            res.append(doc)

        return res

    def leave_project(self, project_manager: ProjectManager, project_id: ObjectId):
        # TODO: this operation should be atomic
        project = self.projects.find_one({"_id": project_id})
        if project is None:
            raise ProjectNotFound()

        # The group is disbanded if the leader leaves
        if self._id == project["leader"]:
            project_manager.delete_project(project_id)

        try:
            project["members"].remove(self._id)
        except ValueError:
            raise UserNotFound()
    
        project["cur_people"] = len(project["members"])

        self.projects.replace_one({"_id": project_id}, project)

    def __str__(self):
        return f'<server.models.user("{str(self._id)}")>'
