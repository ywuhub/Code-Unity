
# API Endpoints

### `/api/user/profile`

#### GET
Returns user profile information for an authenticated user. Will return 401/422 if user is not authenticated.

#### PUT
Updates user profile information for an authenticated user. Will return 401/422 if user is not authenticated.

### `/api/user/<int:uid>/profile`

#### GET
Returns user profile information for a specified user if the current user is authenticated. Will return 401/422 if user is not authenticated.

### `/api/auth`

#### POST
Logs a user in. Will return 400 if username or password is not provided, and 401 if the credentials supplied are not valid.

Expects:

```json
{
    "username": string, # required
    "password": string, # required
}
```

On success, returns:

```json
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
            "中文",
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

Expects the same JSON format as POST /api/project.

#### DELETE
Deletes a project that is owned by the logged in user. Returns 422 if the
project_id is invalid, 404 if the project_id is not found, and 401 if the
logged in user does not own the specified project.

### `/api/project/list`

#### GET
Returns a list of every project's title and their project_id.

```json
[
    {
        "title": "ok test project please ignore",
        "project_id": "5dabdced46e6be107d2a1f98"
    },
    {
        "title": "better test project please ignore",
        "project_id": "5dabf1c0026f1a0cfff5d422"
    }
]
```

### `/api/course_list`
#### GET
Lists all the COMP courses available in UNSW.
```json
[
    {
        "code": string,
        "name": string,
    }
]
```
