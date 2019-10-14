"""
This module provides API endpoint routing.
"""
from server import api
from server.models import User, Auth, Project, NewProject, ProjectList

api.prefix = "/api"
api.add_resource(User, "/user")
api.add_resource(Auth, "/auth")
api.add_resource(NewProject, "/project")
api.add_resource(Project, "/project/<int:project_id>")
api.add_resource(ProjectList, "/project/list")
