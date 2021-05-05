import { HttpRequestHub } from '../../HttpRequestHub';

export const getUsers = (page = 0, size = 10) => {
    const config = {
        method: 'GET',
        url: `/api/admin/user/all?page=${page}&size=${size}`,
    };
    return HttpRequestHub(config);
};

export const createUsers = (obj) => {
    const config = {
        method: 'POST',
        url: `/api/admin/user/add`,
        data: { ...obj }
    };
    return HttpRequestHub(config);
};

export const updateUsers = (id, obj) => {
    const config = {
        method: 'PUT',
        url: `/api/admin/user/${id}`,
        data: { ...obj }
    };
    return HttpRequestHub(config);
};

export const deleteUser = (id) => {
    const config = {
        method: 'DELETE',
        url: `/api/admin/user/${id}`,
    };
    return HttpRequestHub(config);
};
