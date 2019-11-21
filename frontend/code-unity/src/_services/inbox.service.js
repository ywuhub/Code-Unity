import { BehaviorSubject } from 'rxjs';
import config from 'config';
import { authHeader, handleResponse } from '@/_helpers';

const currentUserSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('currentUser')));

export const inboxService = {
    get_invites_sent,
    get_invites_received,
    get_join_requests_sent,
    get_join_requests_received,
    remove_invitation,
    accept_join_invitation,
    remove_join_request_sent,
    accept_join_request,
    decline_join_request,
    currentUser: currentUserSubject.asObservable(),
    get currentUserValue() { return currentUserSubject.value }
};

function get_invites_sent() {
    const projects_options = { method: 'GET', headers: { 'Authorization': authHeader() } };
    return fetch(`${config.apiUrl}/api/user/invite/list`, projects_options)
            .then(response => { return response.json() });
}

function get_invites_received() {
    const projects_options = { method: 'GET', headers: { 'Authorization': authHeader() } };
    return fetch(`${config.apiUrl}/api/user/invite/list?incoming=true`, projects_options)
            .then(response => { return response.json() });
}

function remove_invitation(project_id, user_id) {
    const options = {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', 'Authorization': authHeader() },
        body: JSON.stringify({ project_id: project_id })
    };

    return fetch(`${config.apiUrl}/api/user/${user_id}/invite`, options)
        .then(response => { return response.json(); });
}

function accept_join_invitation(project_id) {
    const options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': authHeader() },
        body: JSON.stringify({ join_from: "invitation" })
    };

    return fetch(`${config.apiUrl}/api/project/${project_id}/join`, options)
        .then(response => { return response.json(); });
}


function get_join_requests_sent() {
    const projects_options = { method: 'GET', headers: { 'Authorization': authHeader() } };
    return fetch(`${config.apiUrl}/api/project/requests`, projects_options)
            .then(response => { return response.json() });
}

function get_join_requests_received() {
    const projects_options = { method: 'GET', headers: { 'Authorization': authHeader() } };
    return fetch(`${config.apiUrl}/api/project/requests?incoming=true`, projects_options)
            .then(response => { return response.json() });
}

function remove_join_request_sent(project_id) {
    const options = {
        method: 'DELETE',
        headers: { 'Authorization': authHeader() },
    };

    return fetch(`${config.apiUrl}/api/project/${project_id}/request`, options)
        .then(response => { return response.json(); });
}

function accept_join_request(project_id, user_id) {
    const options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': authHeader() },
        body: JSON.stringify({ join_from: "request", user_id: user_id })
    };

    return fetch(`${config.apiUrl}/api/project/${project_id}/join`, options)
        .then(response => { return response.json(); });
}

function decline_join_request(project_id, user_id) {
    const options = {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', 'Authorization': authHeader() },
        body: JSON.stringify({ user_id: user_id })
    };

    return fetch(`${config.apiUrl}/api/project/${project_id}/request`, options)
        .then(response => { return response.json(); });
}