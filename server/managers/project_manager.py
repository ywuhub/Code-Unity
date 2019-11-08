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
            project_list = self.db.find({"members": {"$eq": ObjectId(user_id)}})
        else:
            project_list = self.db.find().limit(10)

        for doc in project_list:
            ret.append(doc)

        return ret

    def search_project_listing(self, title: str = None, 
                                     courses: list = None,
                                     languages: list = None,
                                     programming_languages: list = None,
                                     group_crit: str = None):
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
            q_languages = {"languages": {"$in": list(map(lambda x: x.title(), languages))}}
        
        q_programming_languages = None
        if programming_languages:
            q_programming_languages = {"technologies": { "$in": list(map(lambda x: x.title(), programming_languages)) }}

        # check if we are doing a union or disjoin query
        q_group_crit = None
        if group_crit:
            if (group_crit.lower() == "true"):
                q_group_crit = True    

        # check if there is any criteria to search for
        param_list = [q_title, q_courses, q_languages, q_programming_languages]
        q_list = []
        for q in param_list:
            if q != None:
                q_list.append(q)
        
        # check if search criterias are grouped or disjoint
        if q_group_crit:
            # union search (i.e. AND query has to satisfy all of the criterias)
            if q_list:
                result = self.db.find({"$and": q_list})
            else:
                result = self.db.find({})
        else:
            # disjoint search (i.e. OR query has to satisfy any of the criterias)            
            if q_list:
                result = self.db.find({"$or": q_list})
            else:
                result = self.db.find({})

        # append documents of search results to return list
        if result:
            for doc in result:
                ret.append(doc)

        return ret

    def delete_project(self, project: Project):
        self.db.delete_one({"_id": project._id})

    def replace_project(self, old_project: Project, new_project: Project):
        self.db.replace_one({"_id": old_project._id}, new_project.to_dict())
