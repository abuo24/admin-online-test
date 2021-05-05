import React from 'react';
import {connect} from "react-redux";
import {Modal, Button, Form, Input, message, Row, Col} from 'antd';
import {EditOutlined, PlusOutlined} from '@ant-design/icons';

import "../../pages.scss";
import {createModule, updateModule} from "../../../server/config/admin/Module";
import {createUsers, updateUsers} from "../../../server/config/admin/Users";

const initialParams = {
    first_name: null,
    last_name: null,
    createAt:null,
    groupId:localStorage.getItem("groupId"),
};

class ModalForm extends React.Component {
    constructor() {
        super();
        this.state = {
            visible: false,
            isSubmitting: false,
            params: {...initialParams}
        };
        // this.currentForm = React.createRef();
    }

    onFinish = () => {
        const {params} = this.state;
        const objToSend = {
            ...params,
        };
        this.setState({isSubmitting: true}, () => {

            if (this.props.edit) {
                const objId = objToSend.id;
                delete objToSend.id;
                delete objToSend.course;
                console.log(objToSend);
                updateUsers(objId, objToSend).then((res) => {
                    if (res) {
                        message.success('Success');
                    }

                    this.setState({isSubmitting: false, visible: false});
                    this.props.getList();
                    // this.currentForm.current.setFieldsValue(initialParams);
                })
            } else {
                console.log(objToSend);
                createUsers(objToSend).then((res) => {
                    if (res) {
                        message.success('Success');
                    }
                    this.setState({isSubmitting: false, visible: false});
                    this.props.getList();
                    // this.currentForm.current.setFieldsValue(initialParams);
                }).catch(
                    function (error) {
                        // return Promise.reject(error)
                    })
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

    showModal = () => {
        const {edit} = this.props;

        if (edit) {
            const editingObj = this.props.getObj();
            delete editingObj.createAt;

            this.setState({
                visible: true,
                params: {
                    ...editingObj,
                    groupId: localStorage.getItem("groupId")
                },
            });
        } else {
            this.setState({
                visible: true,
                params: {
                    ...initialParams,
                    groupId: localStorage.getItem("groupId")
                }
            });
        }
    };

    handleCancel = () => {
        this.setState({
            visible: false,
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
            groupId
        } = this.state.params;
        const {edit} = this.props;
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
                    width={400}
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
                            groupId,
                        }}
                    >
                        <Row gutter={[16]}>
                            <Col span={24}>
                                <Form.Item
                                    label={"Русское Название"}
                                    name="first_name"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Русское Название!',
                                        },
                                    ]}
                                >
                                    <Input
                                        placeholder={'NameRu'}
                                        name="first_name"
                                        onChange={this.handleInputChange}
                                    />
                                </Form.Item>

                                <Form.Item
                                    label={"Узбекский Название"}
                                    name="last_name"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Узбекский Название!',
                                        },
                                    ]}
                                >
                                    <Input
                                        placeholder={'NameUz'}
                                        name="last_name"
                                        onChange={this.handleInputChange}
                                    />
                                </Form.Item>
                                {!edit ? <Form.Item
                                    label={"Русское Название"}
                                    name="password"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Русское Название!',
                                        },
                                    ]}
                                >
                                    <Input
                                        placeholder={'NameRu'}
                                        name="password"
                                        onChange={this.handleInputChange}
                                    />
                                </Form.Item>:""}
                                <Form.Item
                                    label={"Цена"}
                                    name="phoneNumber"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Цена!',
                                        },
                                    ]}
                                >
                                    <Input
                                        placeholder={'NameUz'}
                                        name="phoneNumber"
                                        onChange={this.handleInputChange}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row className="form-footer" justify="end" gutter={[8]}>
                            <Col>
                                <Form.Item>
                                    <Button onClick={this.handleCancel} disabled={isSubmitting}>
                                        Cancel
                                    </Button>
                                </Form.Item>
                            </Col>
                            <Col>
                                <Form.Item>
                                    <Button type="primary" htmlType="submit" loading={isSubmitting}>
                                        ОК
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
};

export default connect(mapStateToProps)(ModalForm);