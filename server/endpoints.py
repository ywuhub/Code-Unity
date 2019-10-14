"""
This module provides API endpoint routing.
"""
from server import api
from server.models import User, Auth

api.add_resource(User, "/user/<int:uid>")
api.add_resource(Auth, "/auth")
