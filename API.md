
# API Endpoints

### `/api/user/profile`

#### GET
Returns user profile information for an authenticated user. Will return 401 if user is not authenticated.

#### PUT
Updates user profile information for an authenticated user. Will return 401 if user is not authenticated.

### `/api/user/<int:uid>/profile`

#### GET
Returns user profile information for a specified user if the current user is authenticated. Will return 401 if user is not authenticated.

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
#### PUT
Registers a user and then logs them in.

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
