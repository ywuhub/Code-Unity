from flask import Flask
from flask_restful import Api
from pymongo.database import Database

from server.managers.project_manager import ProjectManager
from server.managers.user_manager import UserManager
from server.resource import (
    Auth,
    CourseList,
    LogOut,
    ForgotPassword,
    ResetPassword,
    NewProject,
    OtherProfile,
    ProfileResource,
    AccountResource,
    ProgrammingLanguages,
    ProjectRequest,
    ProjectRequestList,
    ProjectList,
    ProjectResource,
    ProjectJoin,
    ProjectLeave,
    SearchProjects,
    UserInvite,
    UserInviteList,
    UserList,
)


def register_endpoints(
    app: Flask, db: Database, user_manager: UserManager, project_manager: ProjectManager
):
    api = Api(app)

    # Inject resource dependencies with the `resource_class_args` kwarg.
    api.prefix = "/api"
    api.add_resource(AccountResource, "/user/account")
    api.add_resource(ProfileResource, "/user/profile")
    api.add_resource(UserInvite, "/user/<string:uid>/invite")
    api.add_resource(UserInviteList, "/user/invite/list")
    api.add_resource(OtherProfile, "/user/<string:uid>/profile", resource_class_args=[user_manager])
    api.add_resource(ProgrammingLanguages, "/programming_languages", resource_class_args=[db])
    api.add_resource(Auth, "/auth", resource_class_args=[user_manager])
    api.add_resource(LogOut, "/auth/logout", resource_class_args=[user_manager])
    api.add_resource(ForgotPassword, "/forgot_password", resource_class_args=[db])
    api.add_resource(ResetPassword, "/reset_password/<string:token>", resource_class_args=[db])
    api.add_resource(NewProject, "/project")
    api.add_resource(ProjectResource, "/project/<string:project_id>", resource_class_args=[project_manager])
    api.add_resource(ProjectJoin, "/project/<string:project_id>/join", resource_class_args=[project_manager])
    api.add_resource(ProjectLeave, "/project/<string:project_id>/leave", resource_class_args=[project_manager])
    api.add_resource(ProjectList, "/project/list", resource_class_args=[project_manager])
    api.add_resource(ProjectRequest, "/project/<string:project_id>/request", resource_class_args=[project_manager])
    api.add_resource(ProjectRequestList, "/project/requests", resource_class_args=[project_manager])
    api.add_resource(SearchProjects, "/project/search", resource_class_args=[project_manager])
    api.add_resource(CourseList, "/course_list", resource_class_args=[db])
    api.add_resource(UserList, "/user_list", resource_class_args=[db])

    return api
