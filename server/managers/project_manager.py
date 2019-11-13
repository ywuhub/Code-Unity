from server.exceptions import (
    ProjectNotFound,
    UserNotFound,
    AlreadyMemberOf,
    ProjectFull,
)
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
        self.projects = db.get_collection("projects")
        self.users = db.get_collection("users")
        self.invitations = db.get_collection("invitations")
        self.requests = db.get_collection("join_requests")

    def get_project(self, id: ObjectId):
        pipeline = deepcopy(_list_pipeline)
        pipeline.insert(0, {"$match": {"_id": id}})
        for doc in self.projects.aggregate(pipeline):
            return doc

    def get_project_listing(self, user_id: str = None):
        ret = []

        pipeline = deepcopy(_list_pipeline)

        # check if getting a project list for the current user or in general
        if user_id:
            pipeline.insert(0, {"$match": {"members": ObjectId(user_id)}})

        for doc in self.projects.aggregate(pipeline):
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
        for doc in self.projects.aggregate(pipeline):
            ret.append(doc)

        return ret

    def delete_project(self, project_id: ObjectId):
        """
        Removes the project and all its references from the database.
        """
        self.invitations.delete_many({"project_id": project_id})
        self.requests.delete_many({"project_id": project_id})
        self.projects.delete_one({"_id": project_id})

    def update_project(self, project: Project, updated_details: dict):
        self.projects.update({"_id": project._id}, {"$set": updated_details}, upsert=False)

    def add_user_to_project(self, user_id: ObjectId, project_id: ObjectId):
        # TODO: this operation should be atomic.
        project = self.projects.find_one({"_id": project_id})
        if project is None:
            raise ProjectNotFound()

        user = self.users.find_one({"_id": user_id})
        if user is None:
            raise UserNotFound()

        if user_id in project["members"]:
            raise AlreadyMemberOf()

        if len(project["members"]) == project["max_people"]:
            raise ProjectFull()

        project["members"].append(user_id)
        project["cur_people"] = len(project["members"])

        self.projects.replace_one({"_id": project_id}, project)

    def remove_invitation_request(self, user_id: ObjectId, project_id: ObjectId):
        """
        Removes all invitations or requests pertaining to the user and project.
        """
        self.invitations.delete_one({"user_id": user_id, "project_id": project_id})
        self.requests.delete_one({"user_id": user_id, "project_id": project_id})

    def is_request_exist(self, user_id: ObjectId, project_id: ObjectId) -> bool:
        n = self.requests.count_documents(
            {"user_id": user_id, "project_id": project_id}
        )
        return n == 1

    def is_invitation_exist(self, user_id: ObjectId, project_id: ObjectId) -> bool:
        n = self.invitations.count_documents(
            {"user_id": user_id, "project_id": project_id}
        )
        return n == 1
