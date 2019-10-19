from typing import List

from bson import ObjectId


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

    def __init__(self):
        raise NotImplementedError

    @property
    def profile(self) -> Profile:
        raise NotImplementedError

    @profile.setter
    def set_profile(self, value: Profile):
        raise NotImplementedError
