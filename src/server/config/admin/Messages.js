import { HttpRequestHub } from '../../HttpRequestHub';

export const getHistories = (page = 0, size = 10) => {
    const config = {
        method: 'GET',
        url: `/api/client/history/all?page=${page}&size=${size}`,
    };
    return HttpRequestHub(config);
};
export const createMessage = (obj) => {
    const config = {
        method: 'POST',
        url: `/api/superAdmin/message/save`,
        data: { ...obj}
    };
    return HttpRequestHub(config);
};
export const deleteMessage = (id) => {
    const config = {
        method: 'DELETE',
        url: `/api/superAdmin/message/delete/${id}`,
    };
    return HttpRequestHub(config);
};