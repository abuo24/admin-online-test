import { HttpRequestHub } from '../../HttpRequestHub';

export const getUsers = (page = 0, size = 10) => {
    const config = {
        method: 'GET',
        url: `/api/superAdmin/user/getPage?page=${page}&size=${size}`,
    };
    return HttpRequestHub(config);
};

export const createUsers = (obj) => {
    const config = {
        method: 'POST',
        url: `/api/superAdmin/user/save`,
        data: { ...obj }
    };
    return HttpRequestHub(config);
};

export const updateUsers = (id, obj) => {
    const config = {
        method: 'PUT',
        url: `/api/superAdmin/user/edit/${id}`,
        data: { ...obj }
    };
    return HttpRequestHub(config);
};

export const deleteUser = (id) => {
    const config = {
        method: 'DELETE',
        url: `/api/superAdmin/user/delete/${id}`,
    };
    return HttpRequestHub(config);
};

export const reportUser = (username) => {
    const config = {
        method: 'GET',
        url: `/api/auth/report/${username}`,
    };
    return HttpRequestHub(config);
};