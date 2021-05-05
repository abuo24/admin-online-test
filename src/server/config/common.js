import { HttpRequestHub } from '../HttpRequestHub';


export const getUserInfo = () => {
    const config = {
        method: 'GET',
        url: `/api/auth/me`,
    };
    return HttpRequestHub(config);
};

export const getFile = (hashId) => {
    const config = {
        method: 'GET',
        url: `/api/client/file/preview/${hashId}`,
    };
    return HttpRequestHub(config);
};