import { HttpRequestHub } from '../../HttpRequestHub';

export const getParts = ( id) => {
    const config = {
        method: 'GET',
        url: `/api/client/subject/${id}`,
    };
    return HttpRequestHub(config);
};

export const getPart = ( id,psid) => {
    const config = {
        method: 'GET',
        url: `/api/client/subjects/${id}?parentSecondId=${psid}`,
    };
    return HttpRequestHub(config);
};

export const createPart = (obj) => {
    const config = {
        method: 'POST',
        url: `/api/superAdmin/part/save`,
        data: { ...obj }
    };
    return HttpRequestHub(config);
};

export const updatePart = (id, obj) => {
    const config = {
        method: 'PUT',
        url: `/api/superAdmin/part/edit/${id}`,
        data: { ...obj }
    };
    return HttpRequestHub(config);
};

export const deletePart = (id) => {
    const config = {
        method: 'DELETE',
        url: `/api/superAdmin/part/delete/${id}`,
    };
    return HttpRequestHub(config);
};