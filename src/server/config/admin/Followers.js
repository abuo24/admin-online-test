import { HttpRequestHub } from '../../HttpRequestHub';

export const getFollowers = (page = 0, size = 10) => {
    const config = {
        method: 'GET',
        url: `/api/superAdmin/follower/getPage?page=${page}&size=${size}`,
    };
    return HttpRequestHub(config);
};
export const createFollower = (obj) => {
    const config = {
        method: 'POST',
        url: `/api/superAdmin/follower/save`,
        data: { ...obj }
    };
    return HttpRequestHub(config);
};
export const updateFollower = (id, obj) => {
    const config = {
        method: 'PUT',
        url: `/api/superAdmin/follower/edit/${id}`,
        data: { ...obj }
    };
    return HttpRequestHub(config);
};
export const deleteFollower = (id) => {
    const config = {
        method: 'DELETE',
        url: `/api/superAdmin/follower/delete/${id}`,
    };
    return HttpRequestHub(config);
};