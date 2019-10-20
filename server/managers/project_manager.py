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
        raise NotImplementedError

    def add_project(self, project: Project):
        raise NotImplementedError

    def list_projects(self) -> List[Project]:
        raise NotImplementedError

    def modify_project(self, project: Project):
        raise NotImplementedError
