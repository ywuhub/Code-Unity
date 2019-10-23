from typing import List

from bson import ObjectId
from flask import Flask
from pymongo.database import Database

from server.models.project import Project


class ProjectManager:
    __instance = None

    def __init__(self, app: Flask, db: Database):
        self.app = app
        self.db = db.get_collection("projects")
        ProjectManager.__instance = self

    @staticmethod
    def get_instance():
        instance = ProjectManager.__instance
        if instance is None:
            raise LookupError("ProjectManager instance requested before initialization")
        return instance

    def get_project(self, id: ObjectId) -> Project:
        doc = self.db.find_one({"_id": id})
        if doc is None:
            return doc
        return Project.from_dict(doc)

    def get_project_listing(self):
        ret = []
        for doc in self.db.find(projection=["title"]):
            ret.append(doc)
        return ret

    def delete_project(self, project: Project):
        self.db.delete_one({"_id": project._id})

    def replace_project(self, old_project: Project, new_project: Project):
        self.db.replace_one({"_id": old_project._id}, new_project.to_dict())
