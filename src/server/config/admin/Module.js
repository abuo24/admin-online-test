import { HttpRequestHub } from '../../HttpRequestHub';

export const getModule = (courseId) => {
    const config = {
        method: 'GET',
        url: `/api/superAdmin/module/getAll/${courseId}`,
    };
    return HttpRequestHub(config);
};

export const createModule = (obj) => {
    const config = {
        method: 'POST',
        url: `/api/superAdmin/module/save`,
        data: { ...obj }
    };
    return HttpRequestHub(config);
};

export const updateModule = (id, obj) => {
    const config = {
        method: 'PUT',
        url: `/api/superAdmin/module/edit/${id}`,
        data: { ...obj }
    };
    return HttpRequestHub(config);
};

export const deleteModule = (id) => {
    const config = {
        method: 'DELETE',
        url: `/api/superAdmin/module/delete/${id}`,
    };
    return HttpRequestHub(config);
};