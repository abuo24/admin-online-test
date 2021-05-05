import axios from 'axios';

import { getCookie } from "../utils/useCookies";
import { userAccessTokenName } from "../constants";

export const token = getCookie(userAccessTokenName);

export let host = "https://online-test-web-app.herokuapp.com";
// export let host = "https://educational-center-web-app.herokuapp.com";
// export let port = '8084';
export let port = '';

export let headers = {
    'X-Requested-With': 'XMLHttpRequest',
    'Content-Type': 'application/json; charset=utf-8',
    'Authorization': token ?`Bearer ${token}`:''
};

export let axiosInstance = axios.create({
    baseURL: `${host}:${port}`,
    headers,
    timeout: 100000,
});
