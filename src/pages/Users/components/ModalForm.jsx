import React from 'react';
import {connect} from "react-redux";
import {Modal, Button, Form, Input, message, Row, Col, Checkbox } from 'antd';
import {EditOutlined, PlusOutlined} from '@ant-design/icons';

import {host, port} from "../../../server/host";

import "../../pages.scss";
import {createUsers, updateUsers} from "../../../server/config/admin/Users";
import CKEditor from "ckeditor4-react";
import {createTeacher, updateTeacher} from "../../../server/config/admin/Teacher";

const initialParams = {
    first_name: null,
    last_name: null,
    phoneNumber: null,
    password: null,
    telegram: null,
    instagram: null,
    facebook: null,
    aboutUz: null,
    aboutRu: null,
};

class ModalForm extends React.Component {
    constructor() {
        super();
        this.state = {
            visible: false,
            isSubmitting: false,
            params: {...initialParams}
        };
        this.currentForm = React.createRef();
    }
    onFinish = () => {
        const {params} = this.state;
        const objToSend = {
            ...params,
        };
        const {userType} = this.props;
        this.setState({isSubmitting: true}, () => {
            if (this.props.edit) {
                const userId = objToSend.id;
                delete objToSend.id;
                console.log(objToSend);
                userType==='student'?(updateUsers(userId, objToSend).then((res) => {
                    if (res) {
                        res.data.success? message.success(res.data.message):message.error(res.data.message);
                    }
                    this.setState({isSubmitting: false, visible: false});
                    this.props.getList();
                    console.log(initialParams);
                }).catch(e=>{
                    message.success('Request failed!');
                })):(updateTeacher(userId, objToSend).then((res) => {
                    if (res) {
                        res.data.success? message.success(res.data.message):message.error(res.data.message);
                    }
                    this.setState({isSubmitting: false, visible: false});
                    this.props.getList();
                    // this.currentForm.current.setFieldsValue(initialParams);
                }).catch(e=>{
                    message.success('Request failed!');
                }))
            } else {
                console.log(objToSend);
                userType==='student'?(createUsers(objToSend).then((res) => {
                    if (res) {
                        res.data.success? message.success(res.data.message):message.error(res.data.message);
                    }
                    this.setState({isSubmitting: false, visible: false});
                    this.props.getList();
                    this.currentForm.current.setFieldsValue(initialParams);
                }).catch(e=>{
                    message.success('Request failed!');
                })):(createTeacher(objToSend).then((res) => {
                    if (res) {
                        res.data.success? message.success(res.data.message):message.error(res.data.message);
                    }
                    this.setState({isSubmitting: false, visible: false});
                    this.props.getList();
                    this.currentForm.current.setFieldsValue(initialParams);
                }).catch(e=>{
                    message.success('Request failed!');
                }))
            }
        });
    };
    handleInputChange = (e) => {
        const {name, value} = e.target;
        this.setState({
            params: {
                ...this.state.params,
                [name]: value,
            }
        })
    };
    handleSelectChange = (name, value) => {
        if (name) {
            this.setState({
                params: {
                    ...this.state.params,
                    [name]: value,
                }
            })
        }
    };

    showModal = () => {
        const {edit} = this.props;
        if (edit) {
            const editingObj = this.props.getObj();
            let hashCode=editingObj.attachment?editingObj.attachment.hashCode:'';
            delete editingObj.attachment;
            this.setState({
                visible: true,
                params: {
                    ...editingObj,
                },
            });
        } else {
            this.setState({
                visible: true,
            });
        }
    };
    handleCancel = () => {
        this.setState({
            visible: false,
        })
    };
    componentDidMount() {
        const {edit} = this.props;
        if (edit) {

        }
    }
    handleCKUChangeRu = (event) => {
        const data = event.editor.getData();
        this.setState({
            params: {
                ...this.state.params,
                aboutRu: data,
            }
        })
    };
    handleCKUChangeUz = (event) => {
        const data = event.editor.getData();
        this.setState({
            params: {
                ...this.state.params,
                aboutUz: data,
            }
        })
    };
    handleCheckboxChange = (e) => {
        const {name, checked} = e.target;
        this.setState({
            params: {
                ...this.state.params,
                accountNonLocked: checked,
            }
        })
    };
    render() {
        const {
            isSubmitting,
        } = this.state;

        const {
            first_name,
            last_name,
            phoneNumber,
            hashCode,
            username,
            password,
            telegram,
            instagram,
            facebook,
            aboutUz,
            aboutRu,
            accountNonLocked
        } = this.state.params;

        const {edit, courses, userType} = this.props;
        return (
            <React.Fragment>
                {
                    edit ? (
                        <Button onClick={this.showModal} title={"Изменить"}>
                            <EditOutlined/>
                        </Button>
                    ) : (
                        <Button type="primary" onClick={this.showModal} title={"Добавить новое"}>
                            <PlusOutlined/>
                        </Button>
                    )
                }
                <Modal
                    centered
                    closable={false}
                    maskClosable={false}
                    title={edit ? "Изменить" : "Добавить новое"}
                    visible={this.state.visible}
                    footer={null}
                    width={1200}
                    className="lms-form"
                >
                    <Form
                        name="basic"
                        layout="vertical"
                        onFinish={this.onFinish}
                        ref={this.currentForm}
                        initialValues={{
                            first_name,
                            last_name,
                            phoneNumber,
                            password,
                            telegram,
                            instagram,
                            facebook,
                            aboutUz,
                            aboutRu
                        }}
                    >
                        <h3>{"Информация о Студент"}</h3>
                        <Row gutter={[16]}>
                            <Col span={12}>

                                <Form.Item
                                    label={"Имя"}
                                    name="first_name"
                                    rules={[
                                        {
                                            required: true,
                                            message: `Имя!`,
                                        },
                                    ]}
                                >
                                    <Input
                                        placeholder={"Имя"}
                                        name="first_name"
                                        onChange={this.handleInputChange}
                                    />
                                </Form.Item>
                                <Form.Item
                                    label={"Фамилия"}
                                    name="last_name"
                                    rules={[
                                        {
                                            required: true,
                                            message: `Фамилия!`,
                                        },
                                    ]}
                                >
                                    <Input
                                        placeholder={"Фамилия"}
                                        name="last_name"
                                        onChange={this.handleInputChange}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    label={"Телефонный номер"}
                                    name="phoneNumber"
                                    rules={[
                                        {
                                            required: true,
                                            message: `Телефонный номер!`,
                                        },
                                    ]}
                                >
                                    <Input
                                        placeholder={"Телефонный номер"}
                                        name="phoneNumber"
                                        onChange={this.handleInputChange}
                                    />
                                </Form.Item>

                                <Form.Item
                                    label={"Парол"}
                                    name="password"
                                    rules={[
                                        {
                                            message: `Парол!`,
                                        },
                                    ]}
                                >
                                    <Input.Password
                                        placeholder={"Парол"}
                                        name="password"
                                        onChange={this.handleInputChange}
                                    />
                                </Form.Item>

                            </Col>
                        </Row>
                        <Row className="form-footer" justify="end" gutter={[8]}>
                            <Col>
                                <Form.Item>
                                    <Button onClick={this.handleCancel} disabled={isSubmitting}>
                                        Отмена
                                    </Button>
                                </Form.Item>
                            </Col>
                            <Col>
                                <Form.Item>
                                    <Button type="primary" htmlType="submit" loading={isSubmitting}>
                                        Ok
                                    </Button>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </Modal>
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => {
    return {}
}

export default connect(mapStateToProps)(ModalForm);