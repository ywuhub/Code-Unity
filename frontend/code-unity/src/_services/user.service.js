import config from 'config';
import { authHeaderOld, authHeader, handleResponse } from '@/_helpers';

export const userService = {
    getProfile,
    getProjectList,
    getProjectDetail,
    getAll,
    putProfile
};

function getProfile() {
    const requestOptions = { method: 'GET', headers: authHeaderOld() };
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
    return fetch(`${config.apiUrl}/api/user/profile`, requestOptions).then(handleResponse);
};
function getAll() {
    const requestOptions = { method: 'GET', headers: authHeaderOld() };
    return fetch(`${config.apiUrl}/api/user/profile`, requestOptions).then(handleResponse);
}

function getProjectList() {
    const requestOptions = { method: 'GET', headers: authHeader() };
    return fetch(`${config.apiUrl}/api/project/list`, requestOptions).then(handleResponse);
}

function getProjectDetail(id) {
    const requestOptions = { 
                            method: 'GET', 
                            headers: authHeader(),
                            body: JSON.stringify({ id })
                        };
    return fetch(`${config.apiUrl}/api/project/`, requestOptions).then(handleResponse);

}
