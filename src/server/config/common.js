import { HttpRequestHub } from '../HttpRequestHub';


export const getUserInfo = () => {
    const config = {
        method: 'GET',
        url: `/api/auth/me`,
    };
    return HttpRequestHub(config);
};

export const getFile = (id) => {
    const config = {
        method: 'GET',
        url: `/api/auth/file/${id}`,
    };
    return HttpRequestHub(config);
};