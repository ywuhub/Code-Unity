from typing import List, Any, Dict

from bson import ObjectId

from server.managers.project_manager import ProjectManager
from server.models.project import Project
from flask_restful import fields
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

    def __init__(self, id: ObjectId):
        self._id = id

    def new_project(self, title: str, max_people: int, **kwargs):
        return Project(self._id, title, max_people, **kwargs)

    def create_project(self, title: str, max_people: int, **kwargs):
        new_project = self.new_project(title, max_people, **kwargs)
        project_manager = ProjectManager.get_instance()
        return project_manager.add_project(new_project)

    def __str__(self):
        return f'<server.models.user("{str(self._id)}")>'
