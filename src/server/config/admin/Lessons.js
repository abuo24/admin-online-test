import { HttpRequestHub } from '../../HttpRequestHub';

export const getLesson = (page=0, size=10, partId) => {
    const config = {
        method: 'GET',
        url: `/api/superAdmin/lesson/getPage/${partId}?page=${page}&size=${size}`,
    };
    return HttpRequestHub(config);
};

export const createLesson = (obj) => {
    const config = {
        method: 'POST',
        url: `/api/superAdmin/lesson/save`,
        data: { ...obj }
    };
    return HttpRequestHub(config);
};

export const updateLesson = (id, obj) => {
    const config = {
        method: 'PUT',
        url: `/api/superAdmin/lesson/edit/${id}`,
        data: { ...obj }
    };
    return HttpRequestHub(config);
};

export const deleteLesson = (id) => {
    const config = {
        method: 'DELETE',
        url: `/api/superAdmin/lesson/delete/${id}`,
    };
    return HttpRequestHub(config);
};