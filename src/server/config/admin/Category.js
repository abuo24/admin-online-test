import { HttpRequestHub } from '../../HttpRequestHub';

export const getCategories = (page=0, size=100) => {
    const config = {
        method: 'GET',
        url: `/api/superAdmin/category/getPage?page=${page}&size=${size}`,
    };
    return HttpRequestHub(config);
};
export const getCategoriesList = () => {
    const config = {
        method: 'GET',
        url: `/api/superAdmin/category/getAll`,
    };
    return HttpRequestHub(config);
};
export const createCategory = (obj) => {
    const config = {
        method: 'POST',
        url: `/api/superAdmin/category/save`,
        data: { ...obj }
    };
    return HttpRequestHub(config);
};

export const updateCategory = (id, obj) => {
    const config = {
        method: 'PUT',
        url: `/api/superAdmin/category/edit/${id}`,
        data: { ...obj }
    };
    return HttpRequestHub(config);
};

export const deleteCategory = (id) => {
    const config = {
        method: 'DELETE',
        url: `/api/superAdmin/category/delete/${id}`,
    };
    return HttpRequestHub(config);
};