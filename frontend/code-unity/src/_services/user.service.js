import config from 'config';
import { authHeaderOld, handleResponse } from '@/_helpers';

export const userService = {
    getAll
};

function getAll() {
    const requestOptions = { method: 'GET', headers: authHeaderOld() };
    return fetch(`${config.apiUrl}/api/user/profile`, requestOptions).then(handleResponse);
}