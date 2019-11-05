import config from 'config';
import { authHeaderOld, authHeader, handleResponse, GetReponseCode } from '@/_helpers';

export const userService = {
    getProfile,
    getProjectList,
    getProjectDetail,
    getAll,
    putProfile,
    getUserProject,
    getUserProfile
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
    return fetch(`${config.apiUrl}/api/project/list?user_id=${id}`, requestOptions).then(handleResponse);
}
