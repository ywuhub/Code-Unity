import { BehaviorSubject } from 'rxjs';
import config from 'config';
import { authHeader, handleResponse } from '@/_helpers';

const currentUserSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('currentUser')));

export const projectService = {
    create_group,
    join_group,
    leave_group,
    join_requests,
    accept_request,
    currentUser: currentUserSubject.asObservable(),
    get currentUserValue() { return currentUserSubject.value }
};

function create_group(title, max_people, course, description, languages, prog_languages, tags) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': authHeader() },
        body: JSON.stringify({ title: title, max_people: max_people, course: course, description: description, languages: languages, technologies: prog_languages, tags: tags})
    };

    return fetch(`${config.apiUrl}/api/project`, requestOptions)
        .then(handleResponse);
}

function join_group(project_id, message) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': authHeader() },
        body: JSON.stringify({ message: message})
    };

    return fetch(`${config.apiUrl}/api/project/${project_id}/request`, requestOptions)
        .then(handleResponse);
}

function leave_group(project_id) {
    const options = {
        method: 'POST',
        headers: { 'Authorization': authHeader() },
    };

    return fetch(`${config.apiUrl}/api/project/${project_id}/leave`, options)
        .then(response => {return response.json()});
}

function join_requests(incoming) {
    const requestOptions = {
        method: 'GET',
        headers: { 'Authorization': authHeader() },
    };

    if (incoming) {
        return fetch(`${config.apiUrl}/api/project/requests?incoming=true`, requestOptions)
            .then(handleResponse);
    } else {
        return fetch(`${config.apiUrl}/api/project/requests`, requestOptions)
            .then(handleResponse);
    }
}

function accept_request(project_id, user_id, join_from) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': authHeader() },
        body: JSON.stringify({ user_id: user_id, join_from: join_from })
    };

    return fetch(`${config.apiUrl}/api/project/${project_id}/join`, requestOptions)
        .then(handleResponse);
}