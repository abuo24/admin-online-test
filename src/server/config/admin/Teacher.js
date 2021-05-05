import { HttpRequestHub } from '../../HttpRequestHub';

export const getTeachers = (page=0, size=100) => {
    const config = {
        method: 'GET',
        url: `/api/admin/teacher/getPage?page=${page}&size=${size}`,
    };
    return HttpRequestHub(config);
};
export const getTeachersList = () => {
    const config = {
        method: 'GET',
        url: `/api/superAdmin/teacher/findAll`,
    };
    return HttpRequestHub(config);
};

export const createTeacher = (obj) => {
    const config = {
        method: 'POST',
        url: `/api/superAdmin/teacher/save`,
        data: { ...obj }
    };
    return HttpRequestHub(config);
};

export const updateTeacher = (id, obj) => {
    const config = {
        method: 'PUT',
        url: `/api/superAdmin/teacher/edit/${id}`,
        data: { ...obj }
    };
    return HttpRequestHub(config);
};

export const deleteTeacher = (id) => {
    const config = {
        method: 'DELETE',
        url: `/api/superAdmin/teacher/delete/${id}`,
    };
    return HttpRequestHub(config);
};