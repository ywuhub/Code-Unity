from typing import List

from bson import ObjectId


class Project:
    _id: ObjectId
    title: str
    description: str
    course: int
    leader: ObjectId
    members: List[ObjectId]
    max_people: int
    tags: List[str]
    technologies: List[str]
    languages: List[str]

    def __init__(self):
        raise NotImplementedError
