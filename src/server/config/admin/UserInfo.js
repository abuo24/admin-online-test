import { HttpRequestHub } from '../../HttpRequestHub';

export const getPayment = (userId) => {
    const config = {
        method: 'GET',
        url: `/api/superAdmin/payment/getList/${userId}`,
    };
    return HttpRequestHub(config);
};
export const getPaymentById = (id) => {
    const config = {
        method: 'GET',
        url: `/api/superAdmin/payment/${id}`,
    };
    return HttpRequestHub(config);
};
export const getPaymentDetail = (id) => {
    const config = {
        method: 'GET',
        url: `/api/superAdmin/paymentDetail/${id}`,
    };
    return HttpRequestHub(config);
};
export const getAddress = (userId) => {
    const config = {
        method: 'GET',
        url: `/api/superAdmin/address/${userId}`,
    };
    return HttpRequestHub(config);
};
export const createPayment = (obj) => {
    const config = {
        method: 'POST',
        url: `/api/superAdmin/payment/save`,
        data: { ...obj}
    };
    return HttpRequestHub(config);
};
export const createPaymentDetail = (obj) => {
    const config = {
        method: 'POST',
        url: `/api/superAdmin/paymentDetail/save`,
        data: { ...obj}
    };
    return HttpRequestHub(config);
};
export const createAddress = (obj) => {
    const config = {
        method: 'POST',
        url: `/api/superAdmin/address/save`,
        data: { ...obj}
    };
    return HttpRequestHub(config);
};
export const updatePayment = (id, obj) => {
    const config = {
        method: 'PUT',
        url: `/api/superAdmin/payment/edit/${id}`,
        data: { ...obj }
    };
    return HttpRequestHub(config);
};
export const updateAddress = (id, obj) => {
    const config = {
        method: 'PUT',
        url: `/api/superAdmin/address/edit/${id}`,
        data: { ...obj }
    };
    return HttpRequestHub(config);
};
export const updatePaymentDetail = (id, obj) => {
    const config = {
        method: 'PUT',
        url: `/api/superAdmin/paymentDetail/edit/${id}`,
        data: { ...obj}
    };
    return HttpRequestHub(config);
};
export const deletePayment = (id) => {
    const config = {
        method: 'DELETE',
        url: `/api/superAdmin/payment/delete/${id}`,
    };
    return HttpRequestHub(config);
};