import config from 'config';
import { authHeaderOld, authHeader, handleResponse } from '@/_helpers';

export const userService = {
    getProfile,
    getProjectList,
    getProjectDetail,
    getAll
};

function getProfile() {
    const requestOptions = { method: 'GET', headers: {'Content-Type': 'application/json', 'Authorization': authHeader()} };
    return fetch(`${config.apiUrl}/api/user/profile`, requestOptions).then(handleResponse);
};
function getAll() {
    const requestOptions = { method: 'GET', headers: {'Content-Type': 'application/json', 'Authorization': authHeader()} };
    return fetch(`${config.apiUrl}/api/user/profile`, requestOptions).then(handleResponse);
}

function getProjectList() {
    const requestOptions = { method: 'GET', headers: {'Content-Type': 'application/json', 'Authorization': authHeader()} };
    return fetch(`${config.apiUrl}/api/project/list`, requestOptions).then(handleResponse);
}

function getProjectDetail(id) {
    const requestOptions = { 
                            method: 'GET', 
                            headers: {'Content-Type': 'application/json', 'Authorization': authHeader()},
                            body: JSON.stringify({ id })
                        };
    return fetch(`${config.apiUrl}/api/project/`, requestOptions).then(handleResponse);

}
