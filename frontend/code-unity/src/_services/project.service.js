import { BehaviorSubject } from 'rxjs';
import config from 'config';
import { authHeader, handleResponse } from '@/_helpers';

const currentUserSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('currentUser')));

export const projectService = {
    create_group,
    currentUser: currentUserSubject.asObservable(),
    get currentUserValue() { return currentUserSubject.value }
};

function create_group(title, max_people, description) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': authHeader() },
        body: JSON.stringify({ title: title, max_people: max_people, description: description})
    };

    return fetch(`${config.apiUrl}/api/project`, requestOptions)
        .then(handleResponse);
}