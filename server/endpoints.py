from server import api
from server.resource import (
    Auth,
    CourseList,
    LogOut,
    NewProject,
    OtherProfile,
    ProfileResource,
    ProjectResource,
    ProgrammingLanguages,
    ProjectList,
)

api.prefix = "/api"
api.add_resource(ProfileResource, "/user/profile")
api.add_resource(OtherProfile, "/user/<string:username>/profile")
api.add_resource(ProgrammingLanguages, "/programming_languages")
api.add_resource(Auth, "/auth")
api.add_resource(LogOut, "/auth/logout")
api.add_resource(NewProject, "/project")
api.add_resource(ProjectResource, "/project/<string:project_id>")
api.add_resource(ProjectList, "/project/list")
api.add_resource(CourseList, "/course_list")
