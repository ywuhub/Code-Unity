import config from 'config';
import { authHeaderOld, authHeader, handleResponse, GetReponseCode } from '@/_helpers';

export const userService = {
    getProfile,
    getProjectList,
    getProjectDetail,
    getAll,
    putProfile,
    getUserProject,
    getUserProfile,
    putProjectDetail,
    postPassword,
    postUsername,
    postAvatar,
    getUserAccountDetails,
    getUserAvatars
};

function getUserProfile(id) {
    const requestOptions = { method: 'GET', headers: {'Content-Type': 'application/json', 'Authorization': authHeader()} };
    return fetch(`${config.apiUrl}/api/user/${id}/profile`, requestOptions).then(handleResponse);
}

function getProfile() {
    const requestOptions = { method: 'GET', headers: {'Content-Type': 'application/json', 'Authorization': authHeader()} };
    return fetch(`${config.apiUrl}/api/user/profile`, requestOptions).then(handleResponse);
};
function putProfile(name, email, visibility, description, interests, 
                        programming_languages, languages, github) {
    const requestOptions = {
        method: 'PUT',
        headers: {'Content-Type': 'application/json',
                  'Authorization': authHeader()},
        body: JSON.stringify({ 
            "name": name,
            "email": email,
            "visibility": visibility, // "public" or "private
            "description": description,
            "interests": interests,
            "programming_languages": programming_languages,
            "languages": languages,
            "github": github})
    };
    return fetch(`${config.apiUrl}/api/user/profile`, requestOptions).then(GetReponseCode);
};
function getAll() {
    const requestOptions = { method: 'GET', headers: {'Content-Type': 'application/json', 'Authorization': authHeader()} };
    return fetch(`${config.apiUrl}/api/user/profile`, requestOptions).then(handleResponse);
}

function getProjectList() {
    const requestOptions = { method: 'GET', headers: {'Content-Type': 'application/json', 'Authorization': authHeader()} };
    return fetch(`${config.apiUrl}/api/project/list`, requestOptions).then(handleResponse);
}
function getUserProject(id) {
    const requestOptions = { 
                            method: 'GET', 
                            headers: {'Content-Type': 'application/json', 'Authorization': authHeader()},
                        };
    return fetch(`${config.apiUrl}/api/project/list?user_id=${id}`, requestOptions).then(handleResponse);
}

function getProjectDetail(id) {
    const requestOptions = { 
                            method: 'GET', 
                            headers: {'Content-Type': 'application/json', 'Authorization': authHeader()},
                        };
    return fetch(`${config.apiUrl}/api/project/${id}`, requestOptions).then(handleResponse);
}

function putProjectDetail(project_id, title, max_people, description, course, tags, 
                        languages, technologies) {
    const requestOptions = {
        method: 'PUT',
        headers: {'Content-Type': 'application/json',
                  'Authorization': authHeader()},
        body: JSON.stringify({ 
            "title": title,
            "max_people": max_people,
            "description": description,
            "course": course,
            "tags": tags,
            "languages": languages,
            "technologies": technologies})
    };
    return fetch(`${config.apiUrl}/api/project/${project_id}`, requestOptions).then(GetReponseCode);
};

function getUserAccountDetails() {
    const requestOptions = {
        method: 'GET',
        headers: {'Content-Type': 'application/json',
                  'Authorization': authHeader()}
    };

    return fetch(`${config.apiUrl}/api/user/account`, requestOptions).then(handleResponse);
};

function postPassword(password) {
    const requestOptions = {
        method: 'PUT',
        headers: {'Content-Type': 'application/json',
                  'Authorization': authHeader()},
        body: JSON.stringify({ 
            "password": password})
    };

    return fetch(`${config.apiUrl}/api/user/account`, requestOptions).then(GetReponseCode);
};

function postUsername(username) {
    const requestOptions = {
        method: 'PUT',
        headers: {'Content-Type': 'application/json',
                  'Authorization': authHeader()},
        body: JSON.stringify({ 
            "username": username})
    };

    return fetch(`${config.apiUrl}/api/user/account`, requestOptions).then(GetReponseCode);
};

function postAvatar(avatar) {
    const requestOptions = {
        method: 'PUT',
        headers: {'Content-Type': 'application/json',
                  'Authorization': authHeader()},
        body: JSON.stringify({ 
            "avatar": avatar})
    };

    return fetch(`${config.apiUrl}/api/user/account`, requestOptions).then(GetReponseCode);
};

function getUserAvatars(users) {
    const requestOptions = { method: 'GET', headers: {'Content-Type': 'application/json', 'Authorization': authHeader()} };

    var urlAddress = `${config.apiUrl}/api/user_list?user_ids=${users[0]}`;
    for (var i = 1; i < users.length; i++) {
        urlAddress = urlAddress + "&user_ids=" + users[i];
    }
    return fetch(urlAddress, requestOptions).then(handleResponse);
}
