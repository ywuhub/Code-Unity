import config from 'config';
import { authHeader, handleResponse } from '@/_helpers';

export const userService = {
    getProfile,
    getProjectList,
    getProjectDetail
};

function getProfile() {
    const requestOptions = { method: 'GET', headers: authHeader() };
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
