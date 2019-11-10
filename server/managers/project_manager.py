from typing import List

from bson import ObjectId
from flask import Flask
from pymongo.database import Database
from copy import deepcopy

from server.models.project import Project

# Common pipeline for listing projects. Joins userids with the Users table while
# omitting their email and password fields.
_list_pipeline = [
    {
        "$lookup": {
            "from": "users",
            "localField": "leader",
            "foreignField": "_id",
            "as": "leader",
        }
    },
    {
        "$lookup": {
            "from": "users",
            "localField": "members",
            "foreignField": "_id",
            "as": "members",
        }
    },
    {"$unwind": "$leader"},
    # omit unnecessary information about users
    {
        "$project": {
            "leader.password": 0,
            "members.password": 0,
            "leader.email": 0,
            "members.email": 0,
        }
    },
]


class ProjectManager:
    def __init__(self, app: Flask, db: Database):
        self.app = app
        self.db = db.get_collection("projects")

    def get_project(self, id: ObjectId) -> Project:
        doc = self.db.find_one({"_id": id})
        if doc is None:
            return doc
        return Project.from_dict(doc)

    def get_project_listing(self, user_id: str = None):
        ret = []

        pipeline = deepcopy(_list_pipeline)

        # check if getting a project list for the current user or in general
        if user_id:
            pipeline.insert(0, {"$match": {"members": ObjectId(user_id)}})

        for doc in self.db.aggregate(pipeline):
            ret.append(doc)

        return ret

    def search_project_listing(
        self,
        title: str = None,
        courses: list = None,
        languages: list = None,
        programming_languages: list = None,
        group_crit: str = None,
    ):
        ret = []

        # create queries
        q_title = None
        if title:
            q_title = {"title": {"$regex": title, "$options": "i"}}

        q_courses = None
        if courses:
            q_courses = {"course": {"$in": list(map(lambda x: x.upper(), courses))}}

        q_languages = None
        if languages:
            q_languages = {
                "languages": {"$in": list(map(lambda x: x.title(), languages))}
            }

        q_programming_languages = None
        if programming_languages:
            q_programming_languages = {
                "technologies": {
                    "$in": list(map(lambda x: x.title(), programming_languages))
                }
            }

        # check if we are doing a union or disjoin query
        q_group_crit = None
        if group_crit:
            if group_crit.lower() == "true":
                q_group_crit = True

        # check if there is any criteria to search for
        param_list = [q_title, q_courses, q_languages, q_programming_languages]
        q_list = []
        for q in param_list:
            if q != None:
                q_list.append(q)

        pipeline = deepcopy(_list_pipeline)

        # check if search criterias are grouped or disjoint
        if q_group_crit:
            # union search (i.e. AND query has to satisfy all of the criterias)
            if q_list:
                pipeline.insert(0, {"$match": {"$and": q_list}})
        else:
            # disjoint search (i.e. OR query has to satisfy any of the criterias)
            if q_list:
                pipeline.insert(0, {"$match": {"$or": q_list}})

        # append documents of search results to return list
        for doc in self.db.aggregate(pipeline):
            ret.append(doc)

        return ret

    def delete_project(self, project: Project):
        self.db.delete_one({"_id": project._id})

    def replace_project(self, old_project: Project, new_project: Project):
        self.db.replace_one({"_id": old_project._id}, new_project.to_dict())
