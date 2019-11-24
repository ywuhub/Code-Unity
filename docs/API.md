# API Endpoints

## <u>Login and Register</u>

### `/api/auth`

#### POST Request
Logs a user in. Will return 400 if username or password is not provided, and 401 if the credentials supplied are not valid.

Expected Input:
```
{
    "username": string, # required
    "password": string, # required
}
```

Expected Output:
```
{
    "uid":   number,
    "token": string,
}
```

Examples:
```
POST (Input) ->
{
    "username": "testuser",
    "password": "test"
}
(200 OK) <-
{
    "uid": "5daa7be538fcf92a17e6e8d1",
    "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1NzE0NTM5MjUsIm5iZiI6MTU3MTQ1MzkyNSwianRpIjoiY2NmMDU1OWEtNzE3NS00Yzg5LTg2N2ItOGMzYjE1N2MxMjE5IiwiZXhwIjoxNTcxNDU0ODI1LCJpZGVudGl0eSI6IjVkYWE3YmU1MzhmY2Y5MmExN2U2ZThkMSIsImZyZXNoIjpmYWxzZSwidHlwZSI6ImFjY2VzcyJ9.DPmOF4-XRS4gdzLMewMiTDtKE7zdnFB_9AGKlfepuaA"
}

# If missing parameters
(400 BAD REQUEST) <-
{
    "message": {
        "username": "Username required",
        "password": "Password required"
    }
}

# If incorrect username/password
(401 UNAUTHORIZED) <-
{
    "message": "incorrect username or password"
}
```

#### PUT Request
Registers a user and then logs them in. Will return 400 if required fields are missing. 422 if a registered user already owns that username or email.

Expected Input:
```
{
    "username": string, # required
    "email": string,    # required
    "password": string, # required
}
```

Expected Output:
```
{
    "uid":   number,
    "token": string,
}
```

Examples:
```
PUT (Input) ->
{
    "username": "testuser",
    "email": "test@user.com",
    "password": "test"
}
(200 OK) <-
{
    "uid": "5daa7be538fcf92a17e6e8d1",
    "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1NzE0NTM5MjUsIm5iZiI6MTU3MTQ1MzkyNSwianRpIjoiY2NmMDU1OWEtNzE3NS00Yzg5LTg2N2ItOGMzYjE1N2MxMjE5IiwiZXhwIjoxNTcxNDU0ODI1LCJpZGVudGl0eSI6IjVkYWE3YmU1MzhmY2Y5MmExN2U2ZThkMSIsImZyZXNoIjpmYWxzZSwidHlwZSI6ImFjY2VzcyJ9.DPmOF4-XRS4gdzLMewMiTDtKE7zdnFB_9AGKlfepuaA"
}

# If the email "test@user.com" or username "testuser" is already in use.
(422 UNPROCESSABLE ENTITY) <-
{
    "message": {
        "username": "Specified username is in use",
        "email": "Specified email is in use"
    }
}

# If missing parameters
PUT -> {}
(400 BAD REQUEST) <-
{
    "message": {
        "username": "Username required",
        "password": "Password required",
        "email": "Email required"
    }
}
```

## <u>Logout</u>

### `api/auth/logout`

#### POST Request
Logs out an authenticated user. Requires no body.
Will return a 200 response if successfully logged out,
or a 401 if the current user is not logged in.

Expected Input:
```
None
```

Expected Output:
```
(200 OK) <- 
{"msg": "Successfully logged out"}

(401 Unauthorized) <-
{"msg": "Currently not logged in"}
```

## <u>Forgotted Password</u>

### `api/forgot_password`

#### GET Request
Sends a message to reset user's password to a registered email address if they forgot their password.

Expected Input:
```
{
    "email": string # required
}
```

Expected Output:
```
(200 OK) <- {
    "message": Message sent to registered email address if found to reset password
}

# if email is not in the database for password resetting
(400 BAD REQUEST) <- {
    "message": "Error: Email is not registered to an Code Unity account. Please try again!"
}

# if the sendgrid api fails to send the email
(400 BAD REQUEST <- {
    "message": "An error has occured! Please try again."
}
```

## <u>Reset Password</u>

### `api/reset_password/<string:token>`

#### PUT Request
Reset the password from the link sent to the user's email which goes here
and we verify the timed token to see if it has expired.

Expected Input:
```
{
    "token": string # token key with the user id embedded with a 24 hour life
}
```

Expected Output:
```
(200 OK) <- {
    "message": "Password has been reset! Redirecting your to the login page in 5 seconds..."
}

# if user enters a blank password
(400 BAD REQUEST) <- {
    "message": "Please enter a valid password"
}

# if the token has expired so the user must resend the reset password email
(400 BAD REQUEST) <- {
    "message" : "Error: Invalid Token. Please resend reset password request again!"
}
```

## <u>User Accounts</u>

### `api/user/account`

#### GET Request
Returns the account information for the currently logged in user.
Will return 401/422 if user is not authenticated.

Expected Input:
```
None
```

Expected Output:
```
{
    "_id": string,
    "name": string,
    "email": string,
    "avatar": string
}
```

#### PUT Request
Updates the currently logged in user's account information. 
All fields are optional.
Will return 401/422 if user is not authenticated.

Expected Input:
```
{
    "username": string,
    "password": string,
    "avatar": string
}
```

Expected Output:
```
(200 OK) <- {
    "status": "success"
}

# blank input parameter
(400 BAD REQUEST) <- {
    "message": "Username cannot be blank"
}

# user wanted the new username exactly like their current one
(400 BAD REQUEST) <- {
    "error": "cannot change to your current username"
}

# username taken by another user
(400 BAD REQUEST) <- {
    "error": "username already taken!"
}
```

## <u>User Profiles</u>

### `api/user/profile`

#### GET Request
Returns user profile information for an authenticated user.
Will return 401/422 if user is not authenticated.

Expected Input:
```
None
```

Expected Output:
```
(200 OK) <-
{
    "_id": string,
    "name": string,
    "email": string,
    "visibility": string,
    "description": string,
    "interests": string[],
    "programming_languages": string[],
    "languages": string[],
    "github": string
}
```

#### PUT Request
Replaces the information of the currently logged in user's profile with
the supplied information. All fields are optional.
Will return 401/422 if user is not authenticated.

Expected Input:
```
{
    "name": string,
    "email": string,
    "visibility": string, // "public" or "private
    "description": string,
    "interests": string[],
    "programming_languages": string[],
    "languages": string[],
    "github": string
}
```

Expected Output:
```
(200 OK) <-
{
    "message": "success"
}
```

## <u>Other User Profiles</u>

### `api/user/<string:uid>/profile`

#### GET Request
Login required. Returns a profile for the user specified. Will return reduced information if the profile specified is marked as private.

Expected Input:
```
None
```

Expected Output:
```
# if the profile is public
(200 OK) <-
{
    "_id": "string",
    "username": "string",
    "name": "string",
    "email": "string",
    "visibility": "string",
    "description": "string",
    "interests": ["string"],
    "programming_languages": ["string"],
    "languages": ["string"],
    "github": "string"
}

# if the profile is private
(200 OK) <-
{
    "_id": "string",
    "username": "string",
    "visibility": "string"
}

# if the user does not exist
(404 NOT FOUND) <-
{
    "message": "user not found"
}

# if the user id is invalid
(422 UNPROCESSIBLE ENTITY) <-
{
    "message": "invalid user_id: {user_id}"
}
```

## <u>Fetch Programming Languages</u>

### `api/programming_languages`

#### GET Request
Returns a list of all valid programming languages.

Expected Input:
```
None
```

Expected Ouput:
```
(200 OK) <-
[
    "A# .NET",
    "A-0 System",
    "A+",
    "A++",
    "ABAP",
    "ABC",
    ...,
    "Python",
    ...
]
```

## <u>Fetch COMP Courses</u>

### `api/course_list`

#### GET Request
Lists all the COMP courses available in UNSW.

Expected Input:
```
None
```

Expected Output:
```
{
    "code": string,
    "name": string,
}
```

Example:
```
(200 OK) <-
[
    {
        "code": "COMP1000",
        "name": "Introduction to World Wide Web, Spreadsheets and Databases"
    },
    {
        "code": "COMP1400",
        "name": "Programming for Designers"
    }
]
```

## <u>Fetch List Of Users</u>

### `api/user_list`

#### GET Request
Get a list of all usernames in the database private users are removed.
Optional parameter: fetch a list of specific usernames from a list of member ids

Expected Input:
```
{
    "user_ids": [id_1, id_2, ..., id_n]
}
```

Expected Output:
```
(200 OK) <-
{
    "_id": string,
    "username": string,
    "email": string,
    "avatar": string
}
```

Example:
```
(200 OK) <-
[
    {
        "_id": "5daa6efd8805c462ef0d16e1",
        "username": "testuser",
        "email": "test@user.com",
        "avatar": "https://api.adorable.io/avatars/200/code_unity_default.png"
    },
    {
        "_id": "5daa6efd5647c462ef0d16f3",
        "username": "testuser1",
        "email": "test1@user.com",
        "avatar": "https://api.adorable.io/avatars/200/code_unity_default.png"
    }
]
```

If Optional Parameter Given (Example):
```
(200 OK) <-
[
    {
        "_id": "5daa6efd8805c462ef0d16e1",
        "username": "testuser",
        "avatar": "https://api.adorable.io/avatars/200/code_unity_default.png"
    },
    {
        "_id": "5daa6efd5647c462ef0d16f3",
        "username": "testuser1",
        "avatar": "https://api.adorable.io/avatars/200/code_unity_default.png"
    }
]
```

## <u>Creating A New Project</u>

### `api/project`

#### POST Request
Posts a new project listing. Will return 400 if required fields are missing.

Expected Input:
```
{
    "title":        string, # required
    "max_people":   number, # required
    "description":  string,
    "course":       number,
    "tags":         string[],
    "technologies": string[],
    "languages":    string[],
}
```

Expected Output:
```
(200 OK) <-
{
    "project_id": string
}

# if not enought parameters to create new project
(400 BAD REQUEST) <-
{
    "message": "missing fields in parameters"
}
```

## <u>Getting, Fetching And Deleting Projects</u>

### `api/project/<string:project_id>`

#### GET Request
Gets information about a specific project given its project_id. Returns 422 if
the project_id is not in the correct format. 404 if project_id is not found.

Expected Input:
```
{
    "project_id": string
}
```

Expected Output:
```
(200 OK) <-
{
    "title": "Code Unity",
    "leader": "5dabfe830ddd57902efd2fa3",
    "max_people": 5,
    "cur_people": 1,
    "members": [
        "5dabfe830ddd57902efd2fa3"
    ],
    "description": "Nice.",
    "course": "4920",
    "technologies": [
        "assembly",
projects              "python",
        "mongoDB",
        "react"
    ],
    "languages": [
        "chinese",
        "english"
    ],
    "tags": [
        "wam booster",
        "free hd",
        "machine learning",
        "blockchain"
    ]
}

# If project not found
GET /api/project/ffffffffffffffffffffffff ->
(404 NOT FOUND) <-
{
    "message": "project_id ffffffffffffffffffffffff not found"
}

# If project_id isn't in the right format
GET /api/project/ohno ->
(422 UNPROCESSABLE ENTITY) <-
{
    "message": "invalid project_id: ohno"
}
```

#### PUT Request
Updates a project that is owned by the logged in user by replacing it
with the data passed in. Returns 422 if the project_id is invalid, 404 if
the project_id is not found, and 401 if the logged in user does not own
the specified project.

Expected Input:
```
{
    "title": "",
    "max_people": ,
    "course": "",
    "description": "",
    "tags": [],
    "technologies": [ ], # programming languages
    "languages": []
}
{
    "project_id": string
}
```

Expected Output:
```
(200 OK) <- 
{
    "message": "successfully updated project"
}

(400 BAD REQUEST) <-
{
    "message": "new maximum number of members value is less than current amount of members"
}

(401 UNAUTHORIZED ERROR) <-
{
    "message": "only the owner may modify a project"
}

(404 NOT FOUND) <-
{
    "message": "project_id {project_id} not found"
}

(422 UNPROCESSABLE ENTITY) <-
{
    "message": "invalid project_id: {project_id}"
}
```

#### DELETE Request
Deletes a project that is owned by the logged in user. Returns 422 if the
project_id is invalid, 404 if the project_id is not found, and 401 if the
logged in user does not own the specified project.

Expected Input:
```
{
    "project_id": string
}
```

Expected Output:
```
(200 OK) <- 
{
    "message": "successfully deleted the project"
}

(401 UNAUTHORIZED ERROR) <-
{
    "message": "only the owner may delete a project"
}

(404 NOT FOUND) <-
{
    "message": "project_id {project_id} not found"
}

(422 UNPROCESSABLE ENTITY) <-
{
    "message": "invalid project_id: {project_id}"
}
```

## <u>Joining A Project</u>

### `api/project/list`

#### GET Request
Returns a list of the current user's involved projects or
every project's title and their project_id.

Expected Input:
```
None
```

Expected Output:
```
GET ->
(200 OK) <-
    [
        {
            "project_id": "5dac029b8b819e584ff36f8d",
            "title": "Code Unity",
            "leader": {
                "_id": "5dabfe830ddd57902efd2fa3",
                "username": "john"
            },
            "cur_people": 1,
            "members": [
                {
                    "_id": "5daa6efd8805c462ef0d16e1",
                    "username": "testuser"
                },
                {
                    "_id": "5dabfe830ddd57902efd2fa3",
                    "username": "john"
                }
            ],
            "description": "Nice.",
            "course": "4920",
            "tags": [
                "wam booster",
                "free hd",
            ],
            "languages": [
                "chinese",
                "english"
            ],
            "technologies": [
                "python",
                "mongoDB",
                "react"
            ]
        }
    ]
```

## <u>Joining A Project</u>

### `api/project/<string:project_id>/join`

#### POST Request
Allows a user to accept a pending invitation to join a project, or by a
project leader to accept another user's request to join their project.
This consumes the pending invitation and/or pending request.

Expected Input:
```
{
    "join_from": string,  # "request" or "invitation", required

    # if the purpose is to allow a project leader to accept a request,
    # then the "user_id" field must be passed in to denote what user the
    # leader is accepting into the project.
    "user_id": string
}

<string:project_id>: project id for the project to join
```

Expected Output:
```
(200 OK) <- {
    "status": "success"
}

(400 BAD REQUEST) <- {
    "message": "join_from must be 'request' or 'invitation'"
}

(400 BAD REQUEST) <- {
    "message": "'user_id' field required for 'request' type"
}

(400 BAD REQUEST) <- {
    "message": "message": "already a member"
}

(400 BAD REQUEST) <- {
    "message": "message": "project is already full"
}

(404 NOT FOUND) <- {
    "message": "request does not exist"
}

(404 NOT FOUND) <- {
    "message": "invitation does not exist"
}

(404 NOT FOUND) <- {
    "message": "project not found"
}

(404 NOT FOUND) <- {
    "message": "user not found"
}

(422 UNPROCESSIBLE ENTITY) <- {
    "message": "invalid project_id"
}

(422 UNPROCESSIBLE ENTITY) <- {
    "message": "invalid user_id"
}
```

Examples:
```
# To accept an invitation to join a project.
POST ->
{
    "join_from": "invitation"
}
<- (200 OK) 

# To accept an incoming request from a user.
POST ->
{
    "join_from": "request",
    "user_id": "5daa6efd8805c462ef0d16e1"
}
<- (200 OK) 
```

## <u>Leaving A Project</u>

### `api/project/<string:project_id>/leave`

#### POST Request
Removes the logged in user from the specified project. If the user is the
leader of the project, the project is subsequently disbanded.

Expected Input:
```
{
    "project_id": string
}
```

Expected Output:
```
(200 OK) <-
{
    "status": "success"
}

(400 BAD REQUEST) <-
{
    "message": "cannot leave group that user is not part of"
}

(404 NOT FOUND) <-
{
    "message": "message": "project not found"
}

(422 UNPROCESSIBLE ENTITY) <- {
    "message": "invalid project_id"
}
```

## <u>Kicking A Member From A Project</u>

### `api/project/<string:project_id>/kick`

#### POST Request
Kicks the selected user from the project by the group leader.

Expected Input:
```
{
    "project_id": string
}
{
    "user_id": string # user to kick
}
```

Expected Output:
```
(200 OK) <-
{
    "status": "user is successfully kicked"
}

(400 BAD REQUEST) <-
{
    "message": "user_id is not a valid ObjectId"
}

(400 BAD REQUEST) <-
{
    "message": "user not involved in project"
}

(400 BAD REQUEST) <-
{
    "message": "current user is not the project leader so not kicking rights"
}

(400 BAD REQUEST) <-
{
    "message": "cannot kick yourself"
}

(404 NOT FOUND) <-
{
    "message": "project not found"
}

(404 NOT FOUND) <-
{
    "message": "user does not exist
}

(422 UNPROCESSIBLE ENTITY) <- {
    "message": "invalid project_id"
}
```

## <u>Requesting To Join A Project Group</u>

### `api/project/<string:project_id>/request`

#### POST Request
Request to join a group. The owner of the project will have to accept the
user before they are actually considered part of the group.

Expected Input:
```
{
    # Can be omitted if the user provides no join message.
    "message": string
}
```

Expected Output:
```
POST /api/project/<str:project_id>/request ->
(200 OK) <-
{
    "status": "success"
}

# If user is already in the project
(400 BAD REQUEST) <-
{
    "message": "already a member"
}

# If user has already sent a request
(400 BAD REQUEST) <-
{
    "message": "request already pending"
}

# If project is already full
(400 BAD REQUEST) <-
{
    "message": "project is full"
}
```

#### DELETE Request
Removes a join request. This can be initiated by the leader of the project in question or by the user who initiated the request. Will
return with status code 404 if the user does not have a pending request for the project.

Expected Input:
```
{
    "user_id": string,  # optional
}
```

Expected Output:
```
# For the user who made the request to delete it
DELETE /api/project/<str:project_id>/request ->
(200 OK) <-
{
    "status": "success"
}

# For the project leader to reject a user's request to join,

# include a JSON body to specify the user's ID.
DELETE /api/project/<str:project_id>/request ->
{
    "user_id": string
}
(200 OK) <-
{
    "status": "success"
}
```

## <u>Project Request Listings</u>

### `api/project/requests`

#### GET Request
Allows a user to get a list of pending join requests that they have sent,
i.e., join requests that are outgoing. If the "incoming" parameter is set
to true, then the endpoint will return a list of pending incoming join
requests to the projects that they own. 

Expected Input:
```
None
```

Expected Output:
```
GET ->
(200 OK) <-
[
    {
        "project_id": string,
        "project_title": string,
        "message": string
    }
]

GET ?incoming=true ->
(200 OK) <-
[
    {
        "project_id": string,
        "project_title": string,
        "user_id": string,
        "user_name": string,
        "message": string
    }
]
```

## <u>Search Projects</u>

### `api/project/search`

#### GET Request
Fetches the projects according to the search filter

Expected Input:
```
Parameters:
- title: string (title of the group project)
- courses: list (list of courses)
- languages: list (languages spoken by group)
- programming_languages: list (programming languages used in project)
- group_crit: "true" or "false" or else it will default to "None"
                (group the four criterias above as a union condition for the search or not)
```

Expected Output:
```
List of projects according to search criteria
(200 OK) <-
{
    {
        "project_id": "5dac029b8b819e584ff36f8d",
        "title": "Code Unity",
        "leader": {
            "_id": "5dabfe830ddd57902efd2fa3",
            "username": "john"
        },
        "cur_people": 1,
        "members": [
            {
                "_id": "5daa6efd8805c462ef0d16e1",
                "username": "testuser"
            },
            {
                "_id": "5dabfe830ddd57902efd2fa3",
                "username": "john"
            }
        ],
        "description": "Nice.",
        "course": "4920",
        "tags": [
            "wam booster",
            "free hd",
        ],
        "languages": [
            "chinese",
            "english"
        ],
        "technologies": [
            "python",
            "mongoDB",
            "react"
        ]
    }
}
```

## <u>Project Favourites</u>

### `api/user/favourites`

#### GET Request
Fetch the list of favourited projects for the currently logged in user

Expected Input:
```
{
    "user_id": string # the user id from the parameters to fetch their favourite projects
}
```

Expected Output:
```
(200 OK) <-
{
    "user_id": user_id \\ the member id for which this list of favourite projects belongs to
    "favourite_projects": [ \\ list of projects and its details that is favourites of the user
                { 
                    "title": str,
                    "leader": str,
                    "max_people": int,
                    "cur_people": int,
                    "members": [],
                    "description": str,
                    "course": str,
                    "technologies": [],
                    "languages": [],
                    "tags": []
                },
    ]
}

(400 BAD REQUEST) <-
{
    "message": "user id required to fetch the favourites list"
}

(400 BAD REQUEST) <-
{
    "message": "user does not have any favourites"
}

(400 BAD REQUEST) <-
{
    "message": "invalid user id"
}

(404 NOT FOUND) <-
{
    "message": "user not found"
}
```

#### POST Request
Add the selected project to the user's favourites list

Expected Input:
```
Input (url parameters):
- user_id: string
description: the user id for the project to be added to their favourites
- project_id: string
description: the project id to be added to the user's favourites
```

Expected Output:
```
POST api/favourites ->
(200 OK) <-
    {
        "message": "project added to the user's favourites"
    }

(400 BAD REQUEST) <-
{
    "message": "invalid user id or project id"
}

(400 BAD REQUEST) <-
{
    "message": "both user and project id are required"
}

(400 BAD REQUEST) <-
{
"message": "project is already in the favourites list"
}

(404 NOT FOUND) <-
{
    "message": "project not found"
}

(404 NOT FOUND) <-
{
    "message": "user not found"
}
```

#### PUT Request
Remove the selected project from the user's favourites list

Expected Input:
```
Input (url parameters):
- user_id: string
description: the user id for the project to be removed to their favourites
- project_id: string
description: the project id to be removed to the user's favourites
```

Expected Output:
```
PUT api/favourites ->
(200 OK) <-
{
    "status": "project has been removed from favourites successfully"
}

(400 BAD REQUEST) <-
{
    "message": "invalid user id or project id"
}

(400 BAD REQUEST) <-
{
    "message": "both user and project id are required"
}

(400 BAD REQUEST) <-
{
    "message": "user does not have any favourite projects"
}

(400 BAD REQUEST) <-
{
    "message": "the project is not in the favourites list"
}

(404 NOT FOUND) <-
{
    "message": "user not found"
}

(404 NOT FOUND) <-
{
    "message": "project not found"
}
```

## <u>Invite Users To Project Groups</u>

### `api/user/<string:uid>/invite`

#### POST Request
Invite a user to join a group. The user will have to accept the invitation
before they are actually considered part of the group.

Expected Input:
```
{
    "project_id": string  # required
}
```

Expected Output:
```
POST ->
(200 OK) <-
{
    "status": "success"
}
```

#### DELETE Request
Removes an invitation that was sent to a user (outgoing), or for the
        current user to remove an invite that was sent to them (incoming).

Expected Input:
```
{
    "project_id": string # required
}
```

Expected Output:
```
POST ->
(200 OK) <-
{
    "status": "success"
}
```

## <u>Fetch List Of User Invitations</u>

### `api/user/invite/list`

#### GET Request
Allows a user to list the invites that they've sent out or the invites
that other people have sent them if the incoming parameter is set to true.

Expected Input:
```
None
```

Expected Output:
```
# Gets invitations that the user has sent out
GET ->
(200 OK) <-
[
    {
        "project_id": string,
        "project_title": string,
        "user_id": string,
        "user_name": "testuser"  # username of the user invited
    }
]

# Gets invitations that the user has received from others
GET ?incoming=true ->
(200 OK) <- 
[
    {
        "project_id": string,
        "project_title": string,
        "user_id": string,
        "user_name": "testuser"  # username of the user who invited the current user
    }
]
```
