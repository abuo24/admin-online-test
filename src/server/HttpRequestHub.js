import { axiosInstance } from './host';

export const HttpRequestHub = (config = null) => {
    return axiosInstance(config).then((res) => {
        return res;
    }).catch((err) => {
        return null;
    })
};