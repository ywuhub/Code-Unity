import { BehaviorSubject } from 'rxjs';
import config from 'config';
import { authHeader, handleResponse } from '@/_helpers';

const currentUserSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('currentUser')));

export const projectService = {
    create_group,
    join_group,
    join_requests,
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

function join_requests() {
    const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', 'Authorization': authHeader() },
    };

    return fetch(`${config.apiUrl}/api/project/requests`, requestOptions)
        .then(handleResponse);
}