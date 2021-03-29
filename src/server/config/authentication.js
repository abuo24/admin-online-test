import { HttpRequestHub } from '../HttpRequestHub';

export const loginUser = (obj) => {
    const config = {
        method: 'POST',
        url: `/api/auth/signin`,
        data: { ...obj }
    };
    return HttpRequestHub(config);
};

export const resetPassword = (obj) => {
    const config = {
        method: 'POST',
        url: `/api/auth/editPassword`,
        data: {...obj }
    };
    return HttpRequestHub(config);
};
