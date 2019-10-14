from server import api
from server.resource import (
    Profile,
    Auth,
    Project,
    NewProject,
    ProjectList,
    OtherProfile,
)


api.prefix = "/api"
api.add_resource(Profile, "/user/profile")
api.add_resource(OtherProfile, "/user/<int:uid>/profile")
api.add_resource(Auth, "/auth")
api.add_resource(NewProject, "/project")
api.add_resource(Project, "/project/<int:project_id>")
api.add_resource(ProjectList, "/project/list")
