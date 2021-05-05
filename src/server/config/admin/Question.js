import { HttpRequestHub } from '../../HttpRequestHub';

// export const getCourse = (page = 0, size = 10) => {
export const getQuestion = (page, size) => {
    const config = {
        method: 'GET',
        url: `/api/admin/question/all?page=${page}&size=${size}`,
    };
    return HttpRequestHub(config);
};
// export const getCourses = () => {
//     const config = {
//         method: 'GET',
//         url: `/api/client/subject/all`,
//     };
//     return HttpRequestHub(config);
// };
export const getCoursesWithCategoryId = (categoryId) => {
    const config = {
        method: 'GET',
        url: `/api/superAdmin/course/getAll/${categoryId}`,
    };
    return HttpRequestHub(config);
};
export const createQuestion = (obj) => {
    const config = {
        method: 'POST',
        url: `/api/admin/question/add`,
        data: { ...obj}
    };
    return HttpRequestHub(config);
};

export const updateQuestion = (questionId, obj) => {
    const config = {
        method: 'PUT',
        url: `/api/admin/questions/${questionId}`,
        data: { ...obj }
    };
    return HttpRequestHub(config);
};

export const deleteQuestion = (id) => {
    const config = {
        method: 'DELETE',
        url: `/api/admin/question/${id}`,
    };
    return HttpRequestHub(config);
};