import React, { useState } from 'react';
import { Upload, Button, message } from 'antd';

import { UploadOutlined } from '@ant-design/icons';

import { host, port, token } from '../server/host';

const headers = {
    "Authorization": `Bearer ${token}`,
}

const FileUpload = (props) => {
    const { fileList, name, content, multiple } = props;
    const fileListOfParent = fileList ? fileList : [];

    const [uploadedList, setFileList] = useState(fileListOfParent);

    const onChange = ({ fileList: newFileList }) => {
        setFileList(newFileList);
        if (newFileList && newFileList.length) {
            if (props.multiple) {

            } else {
                const response = newFileList[0]['response'];
                if (response) {
                    message.success("Successfully uploaded");
                    const path = response['id'];
                    props.handleChange(name, path);
                }
            }
        }
    };

    const onPreview = async file => {
        let src = file.url;
        // let src = file;
        if (!src) {
            src = await new Promise(resolve => {
                const reader = new FileReader();
                reader.readAsDataURL(file.originFileObj);
                reader.onload = () => resolve(reader.result);
            });
        }
        const image = new Image();
        image.src = src;
        const imgWindow = window.open(src);
        imgWindow.document.write(image.outerHTML);
    }

    const onRemove = (file) => {
        props.handleChange(props.name, null);
    }

    if (!props.path) {
        return null;
    }

    return (
        <Upload
            name="file"
            action={`${host}:${port}/api${props.path}`}
            headers={headers}
            onChange={onChange}
            // onPreview={onPreview}
            onRemove={onRemove}
            listType="text"
            fileList={uploadedList}
        >
            {
                multiple ? (
                    uploadedList.length < 6 && (
                        <Button>
                            <UploadOutlined /> {props.content.upload_img_btn_label}
                        </Button>
                    )
                ) : (
                        uploadedList.length < 1 && (
                            <Button>
                                <UploadOutlined /> {props.content.upload_img_btn_label}
                            </Button>
                        )
                    )
            }
        </Upload>
    );
};

export default FileUpload;