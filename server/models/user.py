from server.models.project import Project
from typing import List

from bson import ObjectId
from server.managers.project_manager import ProjectManager


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

    def __init__(self, id: ObjectId):
        self._id = id

    def create_project(self, title: str, max_people: int, **kwargs):
        new_project = Project(self._id, title, max_people, **kwargs)
        project_manager = ProjectManager.get_instance()
        return project_manager.add_project(new_project)

    @property
    def profile(self) -> Profile:
        raise NotImplementedError

    @profile.setter
    def set_profile(self, value: Profile):
        raise NotImplementedError

    def __str__(self):
        return f'<server.models.user("{str(self._id)}")>'
