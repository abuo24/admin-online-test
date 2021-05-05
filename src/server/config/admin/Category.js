import { HttpRequestHub } from '../../HttpRequestHub';

export const getCategories = (page=0, size=10) => {
    const config = {
        method: 'GET',
        url: `/api/admin/group/all?page=${page}&size=${size}`,
    };
    return HttpRequestHub(config);
};
export const getSubjectById = (id) => {
    const config = {
        method: 'GET',
        url: `/api/client/subject/${id}`,
    };
    return HttpRequestHub(config);
};
export const createCategory = (obj) => {
    const config = {
        method: 'POST',
        url: `/api/admin/group/add`,
        data: { ...obj }
    };
    return HttpRequestHub(config);
};

export const updateCategory = (id, obj) => {
    const config = {
        method: 'PUT',
        url: `/api/admin/group/${id}`,
        data: { ...obj }
    };
    return HttpRequestHub(config);
};

export const deleteCategory = (id) => {
    const config = {
        method: 'DELETE',
        url: `/api/admin/group/${id}`,
    };
    return HttpRequestHub(config);
};