import { HttpRequestHub } from '../../HttpRequestHub';

export const getFollowers = (page = 0, size = 10) => {
    const config = {
        method: 'GET',
        url: `/api/admin/route/all?page=${page}&size=${size}`,
    };
    return HttpRequestHub(config);
};
export const createFollower = (obj) => {
    const config = {
        method: 'POST',
        url: `/api/admin/route/add`,
        data: { ...obj }
    };
    return HttpRequestHub(config);
};
export const updateFollower = (routeId, obj) => {
    const config = {
        method: 'PUT',
        url: `/api/admin/route/${routeId}`,
        data: { ...obj }
    };
    return HttpRequestHub(config);
};
export const deleteFollower = (routeId) => {
    const config = {
        method: 'DELETE',
        url: `/api/admin/route/${routeId}`,
    };
    return HttpRequestHub(config);
};