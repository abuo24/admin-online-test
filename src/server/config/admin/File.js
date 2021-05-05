import { HttpRequestHub } from '../../HttpRequestHub';
import {post,put} from "axios";
import {host, port, token} from "../../host";

export const fileUpload=(file, auth=true)=>{
    const url = `${host}:${port}/api/admin/upload`;
    const formData = new FormData();
    formData.append('file',file);
    const config = {
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'Authorization': token ?`Bearer ${token}`:'',
            'content-type': 'multipart/form-data'
        }
    };
    return  post(url, formData,config)
};
// export const fileEdit=(file, hashId)=>{
//     const url = `${host}:${port}/api/admin/file/edit/${hashId}`;
//     const formData = new FormData();
//     formData.append('file',file);
//     const config = {
//         headers: {
//             'X-Requested-With': 'XMLHttpRequest',
//             'Authorization': token ?`Bearer ${token}`:'',
//             'content-type': 'multipart/form-data'
//         }
//     };
//     return  put(url, formData, config)
// };
export const getFiles = (page = 0, size = 10) => {
    const config = {
        method: 'GET',
        url: `/api/admin/files?page=${page}&size=${size}`,
    };
    return HttpRequestHub(config);
};
export const deleteFile = (hashCode) => {
    const config = {
        method: 'DELETE',
        url: `/api/admin/file/${hashCode}`,
    };
    return HttpRequestHub(config);
};