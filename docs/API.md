
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
Logs out an authenticated user. Requires no body. Will return a 200 response if successfully logged out, or a 422 if the current user is not logged in.

#### PUT
Registers a user and then logs them in. Will return 400 if required fields are missing. 422 if a registered user already owns that username or email.

Expects:

```json
{
    "username": string, # required
    "email": string,    # required
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
PUT ->
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

### `/api/project`

#### POST
Allows an authenticated user to post a project listing.

### `/api/project/<int:project_id>`

#### GET
Returns information about a specific project.

#### PUT
Allows an authenticated user to update details of a project listing they own. 

#### DELETE
Allows an authenticated user to delete a project listing they own.

### `/api/project/list`

#### GET
List projects.


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
