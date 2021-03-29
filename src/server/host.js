import axios from 'axios';

import { getCookie } from "../utils/useCookies";
import { userAccessTokenName } from "../constants";

export const token = getCookie(userAccessTokenName);

// export let host = "https://onlinezako.herokuapp.com";
export let host = "http://localhost";
export let port = '8081';
// export let port = '80';

export let headers = {
    'X-Requested-With': 'XMLHttpRequest',
    'Content-Type': 'application/json; charset=utf-8',
    'Authorization': token ?`Bearer ${token}`:''
};

export let axiosInstance = axios.create({
    baseURL: `${host}:${port}`,
    headers,
    timeout: 30000,
});
