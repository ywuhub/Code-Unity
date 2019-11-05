from typing import List

from bson import ObjectId
from flask import Flask
from pymongo.database import Database

from server.models.project import Project


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

        # check if getting a project list for the current user or in general
        if user_id:
            project_list = self.db.find({"members": {"$eq": ObjectId(user_id)} })
        else:
            project_list = self.db.find().limit(10)

        for doc in project_list:
            ret.append(doc)
            
        return ret

    def search_project_listing(self):
        pass

    def delete_project(self, project: Project):
        self.db.delete_one({"_id": project._id})

    def replace_project(self, old_project: Project, new_project: Project):
        self.db.replace_one({"_id": old_project._id}, new_project.to_dict())