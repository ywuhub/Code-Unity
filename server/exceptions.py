class ProjectNotFound(Exception):
    pass


class ProjectFull(Exception):
    pass


class AlreadyMemberOf(Exception):
    pass


class UserNotFound(Exception):
    pass


class DocumentNotFound(Exception):
    pass


class NotProjectLeader(Exception):
    pass


class UserNotInvolved(Exception):
    pass


class CannotKickYourself(Exception):
    pass