
# API Endpoints

### `/api/user/profile`

#### GET
Returns user profile information for an authenticated user. Will return 401/422 if user is not authenticated.


Returns:
```
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

#### PUT
Replaces the information of the currently logged in user's profile with the supplied  information.
All fields are optional. Will return 401/422 if user is not authenticated. 400 if there are invalid fields in the JSON.


Expects:
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

### `/api/user/<str:uid>/profile`

#### GET
Login required. Returns a profile for the user specified. Will return reduced
information if the profile specified is marked as private.

Example:
```
GET ->
# If the profile is public
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
# If the profile is private
(200 OK) <-
{
    "_id": "string",
    "username": "string",
    "visibility": "string"
}
```

### `/api/auth`

#### POST
Logs a user in. Will return 400 if username or password is not provided, and 401 if the credentials supplied are not valid.

Expects:

```
{
    "username": string, # required
    "password": string, # required
}
```

On success, returns:

```
{
    "uid":   number,
    "token": string,
}
```

Examples:

```
POST ->
    {
        "username": "testuser",
        "password": "test"
    }
(200 OK) <-
    {
        "uid": "5daa7be538fcf92a17e6e8d1",
        "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1NzE0NTM5MjUsIm5iZiI6MTU3MTQ1MzkyNSwianRpIjoiY2NmMDU1OWEtNzE3NS00Yzg5LTg2N2ItOGMzYjE1N2MxMjE5IiwiZXhwIjoxNTcxNDU0ODI1LCJpZGVudGl0eSI6IjVkYWE3YmU1MzhmY2Y5MmExN2U2ZThkMSIsImZyZXNoIjpmYWxzZSwidHlwZSI6ImFjY2VzcyJ9.DPmOF4-XRS4gdzLMewMiTDtKE7zdnFB_9AGKlfepuaA"
    }
# If missing params
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

### `/api/auth/logout`

#### POST
Logs out an authenticated user. Requires no body. Will return a 200 response if successfully logged out, or a 401 if the current user is not logged in.

### `/api/project`

#### POST
Allows an authenticated user to post a project listing.

### `/api/project/<str:project_id>`

#### GET
Gets information about a specific project given its project_id. Returns 422 if
the project_id is not in the correct format. 404 if project_id is not found.

Example:
```
GET /api/project/5dac029b8b819e584ff36f8d ->
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
        "course": 4920,
        "technologies": [
            "assembly",
            "python",
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
GET /api//project/ffffffffffffffffffffffff ->
(404 NOT FOUND) <-
    {
        "message": "project_id ffffffffffffffffffffffff not found"
    }
# If project_id isn't in the right format
GET /api//project/ohno ->
(422 UNPROCESSABLE ENTITY) <-
    {
        "message": "invalid project_id: ohno"
    }
```

#### PUT
Updates a project that is owned by the logged in user by replacing it
with the data passed in. Returns 422 if the project_id is invalid, 404 if
the project_id is not found, and 401 if the logged in user does not owned
the specified project.

Expects the JSON format:
{
    "title": "",
    "max_people": ,
    "course": "",
    "description": "",
    "tags": [],
    "technologies": [ ], # programming languages
    "languages": []
}

But all parameters are optional.

#### DELETE
Deletes a project that is owned by the logged in user. Returns 422 if the
project_id is invalid, 404 if the project_id is not found, and 401 if the
logged in user does not own the specified project.

### `/api/project/list`

#### GET
Returns a list of 10 project's and their full details.

```
[
 {
        "project_id": "5dac029b8b819e584ff36f8d",
        "title": "Code Unity",
        "leader": "5dabfe830ddd57902efd2fa3",
        "cur_people": 1,
        "members": [
            "5dabfe830ddd57902efd2fa3"
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

### `/api/course_list`
#### GET
Lists all the COMP courses available in UNSW.
```
[
    {
        "code": string,
        "name": string,
    }
]
```

### `/api/project/<str:project_id>/request`
#### POST
Request to join a group. The owner of the project will have to accept the
user before they are actually considered part of the group.

Expects:
```
{
    # Can be an omitted if the user provides no join message.
    "message": string
}
```

Examples:
```
POST /api/project/<str:project_id>/request ->
(200 OK) <-

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

#### DELETE
Removes a join request. Will return with status code 400 if the user does
not have a pending request for the project.

Example:
```
DELETE /api/project/<str:project_id>/request ->
(200 OK) <-
```

### `/api/project/requests`
#### GET
Allows a user to get a list of pending join requests that they have sent,
i.e., join requests that are outgoing. If the "incoming" parameter is set
to true, then the endpoint will return a list of pending incoming join
requests to the projects that they own. 

Example:
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

### `/api/user/<string:uid>/invite`
#### POST
Invite a user to join a group. The user will have to accept the invitation
before they are actually considered part of the group.

Expects:
```
{
    "project_id": string  # required
}
```

#### DELETE
Removes an invitation that was sent to a user.

Expects:
```
{
    "project_id": string,  # required
}
```

### `/api/user/invite/list`
#### GET
Allows a user to list the invites that they've sent out or the invites
that other people have sent them if the incoming parameter is set to true.

Example:
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

### `/api/project/<string:project_id>/join`
#### POST
Allows a user to accept a pending invitation to join a project, or by a
project leader to accept another user's request to join their project.
This consumes the pending invitation and/or pending request.

Expects:
```
{
    "join_from": string,  # "request" or "invitation", required

    # if the purpose is to allow a project leader to accept a request,
    # then the "user_id" field must be passed in to denote what user the
    # leader is accepting into the project.
    "user_id": string
}
```

Examples:
```
# To accept an invitation to join a project.
POST ->
{
    "join_from": "invitation"
}
# If the user has an invitation for the project.
(200 OK) <-

# To accept an incoming request from a user.
POST ->
{
    "join_from": "request",
    "user_id": "5daa6efd8805c462ef0d16e1"
}
(200 OK) <-
```

### `api/project/<string:project_id>/leave`
#### POST
Removes the logged in user from the specified project. If the user is the
leader of the project, the project is subsequently disbanded.

### `api/project/<string:project_id>/kick`
#### POST
Kicks the selected user from the project by the group leader.

Expects:
```
{
    "user_id": string, 
    Description: A member id that the project leader wants to kick
}
```

### `api/user/account`
#### GET
Returns the account information for the currently logged in user.
Will return 401/422 if user is not authenticated.

Returns:
```
    {
        "_id": string,
        "name": string,
        "email": string,
        "avatar": string
    }
```
#### POST
Updates the currently logged in user's account information. 
Will return 401/422 if user is not authenticated.

Parameters (All fields are optional) : 
```
    {
        "username": string,
        "password": string,
        "avatar": string
    }
```

### 'api/forgot_password?email=test@example.com'
##### GET
Sends a message to reset user's password to a registered email address if they forgot their password.
INPUT:
- email: a email that is linked to a code unity account or else error will be sent back

EXAMPLE:
```
GET api/forgot_password?email=test@example.com ->
    (200 OK) <-
        Message sent to registered email address if found to reset password
```

### `api/reset_password/<token_key:string>?password=new_password`
#### PUT
Reset the password from the link sent to the user's email which goes here
and we verify the timed token to see if it has expired.
INPUT:
- token: token key with the user id embedded with a 24 hour life

EXAMPLE:
```
PUT api/reset_password/<token_key:string>?password=new_password ->
    (200 OK) <-
        "message": "Password has been reset! Redirecting your to the login page in 5 seconds..."
```