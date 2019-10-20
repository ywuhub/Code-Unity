from typing import Any, Dict, List

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
    # multi_valued_keys and single_valued_keys are used for endpoint request
    # parsing.
    multi_valued_keys = frozenset(("tags", "technologies", "languages"))
    single_valued_keys = frozenset(("description", "course"))
    # project_fields may contain additional fields for system use only, e.g., members
    project_fields = frozenset.union(
        multi_valued_keys, single_valued_keys, frozenset(("members"))
    )

    def __init__(self, leader: ObjectId, title: str, max_people: int, **kwargs):
        # Set mandatory fields
        self.title = title
        self.leader = leader
        self.max_people = max_people

        project_fields = Project.project_fields
        # Update the rest of the optional args
        for k, v in kwargs.items():
            # Skip stuff that aren't whitelisted for unpacking
            if k not in project_fields:
                continue
            setattr(self, k, v)

    def to_dict(self):
        d: Dict[str, Any] = {}
        d["title"] = self.title
        d["leader"] = self.leader
        d["max_people"] = self.max_people

        for k, v in self.__dict__.items():
            if k not in Project.project_fields:
                continue
            if isinstance(v, list):
                if len(v) > 0 and v[0] is not None:
                    d[k] = v
            elif v is not None:
                d[k] = v

        return d

    @staticmethod
    def from_dict(d: Dict[str, Any]):
        raise NotImplementedError
