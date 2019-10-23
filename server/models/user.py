from typing import List

from bson import ObjectId
from pymongo.database import Database

from server.models.project import Project


class Profile:
    name: str
    visible: bool
    description: str
    technologies: List[str]
    languages: List[str]
    github: str

    def __init__(self):
        raise NotImplementedError


class User:
    _id: ObjectId

    def __init__(self, id: ObjectId, db: Database):
        self._id = id
        self.projects = db.get_collection("projects")

    def create_project(self, title: str, max_people: int, **kwargs):
        new_project = Project(self._id, title, max_people, **kwargs)
        return self.projects.insert_one(new_project.to_dict()).inserted_id

    @property
    def profile(self) -> Profile:
        raise NotImplementedError

    @profile.setter
    def set_profile(self, value: Profile):
        raise NotImplementedError

    def __str__(self):
        return f'<server.models.user("{str(self._id)}")>'
