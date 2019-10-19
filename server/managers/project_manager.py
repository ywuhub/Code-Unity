from typing import List

from bson import ObjectId
from flask import Flask
from pymongo.database import Database

from server.models.project import Project


class ProjectManager:
    def __init__(self, app: Flask, db: Database):
        raise NotImplementedError

    def get_project(self, id: ObjectId) -> Project:
        raise NotImplementedError

    def add_project(self, project: Project):
        raise NotImplementedError

    def list_projects(self) -> List[Project]:
        raise NotImplementedError

    def modify_project(self, project: Project):
        raise NotImplementedError
