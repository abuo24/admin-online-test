import { HttpRequestHub } from '../../HttpRequestHub';

// export const getCourse = (page = 0, size = 10) => {
export const getCourse = (page, size) => {
    const config = {
        method: 'GET',
        url: `/api/superAdmin/course/getPage?page=${page}&size=${size}`,
    };
    return HttpRequestHub(config);
};
export const getCourses = () => {
    const config = {
        method: 'GET',
        url: `/api/superAdmin/course/getAll`,
    };
    return HttpRequestHub(config);
};
export const getCoursesWithCategoryId = (categoryId) => {
    const config = {
        method: 'GET',
        url: `/api/superAdmin/course/getAll/${categoryId}`,
    };
    return HttpRequestHub(config);
};
export const createCourse = (obj) => {
    const config = {
        method: 'POST',
        url: `/api/superAdmin/course/save`,
        data: { ...obj}
    };
    return HttpRequestHub(config);
};

export const updateCourse = (id, obj) => {
    const config = {
        method: 'PUT',
        url: `/api/superAdmin/course/edit/${id}`,
        data: { ...obj }
    };
    return HttpRequestHub(config);
};

export const deleteCourse = (id) => {
    const config = {
        method: 'DELETE',
        url: `/api/superAdmin/course/delete/${id}`,
    };
    return HttpRequestHub(config);
};