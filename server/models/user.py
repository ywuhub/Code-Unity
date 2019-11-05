from typing import Any, Dict, List, Optional

from bson import ObjectId
from flask_restful import fields
from pymongo.database import Database

from server.exceptions import AlreadyMemberOf, ProjectFull, ProjectNotFound
from server.models.project import Project
from server.utils.json import ObjectId as ObjectIdMarshaller

profile_fields = {
    "_id": ObjectIdMarshaller,
    "name": fields.String(default=None),
    "email": fields.String(),
    "visibility": fields.String,
    "description": fields.String(default=None),
    "interests": fields.List(fields.String, default=None),
    "programming_languages": fields.List(fields.String, default=None),
    "languages": fields.List(fields.String, default=None),
    "github": fields.String(default=None),
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


class User:
    _id: ObjectId

    def __init__(self, id: ObjectId, db: Database):
        self._id = id
        self.db = db
        self.profiles = db.get_collection("profiles")
        self.projects = db.get_collection("projects")

    def create_project(self, title: str, max_people: int, **kwargs):
        new_project = Project(self._id, title, max_people, **kwargs)
        return self.projects.insert_one(new_project.to_dict()).inserted_id

    @property
    def profile(self) -> Profile:
        ret = self.profiles.find_one({"_id": self._id})

        if ret is None:
            return Profile()

        return Profile.from_dict(ret)

    def update_profile(self, profile: Dict):
        """
        Replaces the user's current profile or creates it if it does not exist.
        """
        self.profiles.replace_one({"_id": self._id}, profile, upsert=True)

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
            {
                "$lookup": {
                    "from": "projects",
                    "localField": "project_id",
                    "foreignField": "_id",
                    "as": "project",
                }
            },
            {"$match": {"user_id": self._id}},
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

    def __str__(self):
        return f'<server.models.user("{str(self._id)}")>'
