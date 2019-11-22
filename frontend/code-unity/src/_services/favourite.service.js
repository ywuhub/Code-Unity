import { BehaviorSubject } from 'rxjs';
import config from 'config';
import { authHeader, handleResponse } from '@/_helpers';

const currentUserSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('currentUser')));

export const favouriteService = {
    add_favourite,
    remove_favourite,
    get_favourite
};

function add_favourite(user_id, project_id) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': authHeader() },
        body: JSON.stringify({ user_id: user_id, project_id: project_id })
    };

    return fetch(`${config.apiUrl}/api/user/favourites`, requestOptions)
        .then(handleResponse);
}

function remove_favourite(user_id, project_id) {
    const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': authHeader() },
        body: JSON.stringify({ user_id: user_id, project_id: project_id })
    };

    return fetch(`${config.apiUrl}/api/user/favourites`, requestOptions)
        .then(handleResponse);
}

function get_favourite(user_id) {
    const requestOptions = {
        method: 'GET',
        headers: { 'Authorization': authHeader() },
    };

    return fetch(`${config.apiUrl}/api/user/favourites?user_id=${user_id}`, requestOptions)
        .then(handleResponse);
}