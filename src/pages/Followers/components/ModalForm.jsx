import React from 'react';
import { connect } from "react-redux";
import { Modal, Button, Form, Input, Select, message, Row, Col} from 'antd';
import { EditOutlined, PlusOutlined } from '@ant-design/icons';

import "../../pages.scss";
import {createFollower, updateFollower} from "../../../server/config/admin/Followers";

const initialParams = {
    fullName: null,
    email: null,
    phoneNumber:null,
    interest: null,
};

class ModalForm extends React.Component {
    constructor() {
        super();
        this.state = {
            visible: false,
            isSubmitting: false,
            params: { ...initialParams }
        };
        this.currentForm = React.createRef();
    }

    onFinish = () => {
        const { params } = this.state;
        const objToSend = {
            ...params,
        };

        this.setState({ isSubmitting: true }, () => {

            if (this.props.edit) {
                const userId = objToSend.id;
                delete objToSend.id;
                updateFollower(userId, objToSend).then((res) => {
                    if (res) {
                        this.setState({ isSubmitting: false, visible: false });
                        res.data.success? message.success(res.data.message):message.error(res.data.message);
                    } else {
                        this.setState({ isSubmitting: false, visible: false });
                    }
                    this.props.getList();
                    // this.currentForm.current.setFieldsValue(initialParams);
                }).catch(e=>{
                    message.success('Request failed!');
                })
            } else {
                createFollower(objToSend).then((res) => {
                    if (res) {
                        this.setState({ isSubmitting: false, visible: false });
                        res.data.success? message.success(res.data.message):message.error(res.data.message);
                    } else {
                        this.setState({ isSubmitting: false, visible: false });
                    }
                    this.props.getList();
                    this.currentForm.current.setFieldsValue(initialParams);
                }).catch(e=>{
                    message.success('Request failed!');
                })
            }
        });
    };

    handleInputChange = (e) => {
        const { name, value } = e.target;
        this.setState({
            params: {
                ...this.state.params,
                [name]: value,
            }
        })
    };
    showModal = () => {
        const { edit } = this.props;
        if (edit) {
            const editingObj = this.props.getObj();
            delete editingObj.createAt;
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
        const {edit}=this.props;
        if (edit){

        }
    }

    render() {
        const {
            isSubmitting,
        } = this.state;

        const {
            fullName,
            email,
            phoneNumber,
            interest,
        } = this.state.params;

        const { edit } = this.props;

        return (
            <React.Fragment>
                {
                    edit ? (
                        <Button onClick={this.showModal} title={"Изменить"}>
                            <EditOutlined />
                        </Button>
                    ) : (
                            <Button type="primary" onClick={this.showModal} title={"Добавить новое"}>
                                <PlusOutlined />
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
                    width={600}
                    className="lms-form"
                >
                    <Form
                        name="basic"
                        layout="vertical"
                        onFinish={this.onFinish}
                        ref={this.currentForm}
                        initialValues={{
                            fullName,
                            email,
                            phoneNumber,
                            interest,
                        }}
                    >
                        <h3>Информация о Подписчики</h3>
                        <Row gutter={[16]}>

                            <Col span={24}>
                                <Form.Item
                                    label={"Полное имя"}
                                    name="fullName"
                                    rules={[
                                        {
                                            required: true,
                                            message: `Полное имя!`,
                                        },
                                    ]}
                                >
                                    <Input
                                        placeholder={"Полное имя"}
                                        name="fullName"
                                        onChange={this.handleInputChange}
                                    />
                                </Form.Item>

                                <Form.Item
                                    label={"Эл. почта"}
                                    name="email"
                                    rules={[
                                        {
                                            required: true,
                                            message: `Эл. почта!`,
                                        },
                                    ]}
                                >
                                    <Input
                                        placeholder={"Эл. почта"}
                                        name="email"
                                        onChange={this.handleInputChange}
                                    />
                                </Form.Item>
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
                                    label={"Интерес"}
                                    name="interest"
                                    rules={[
                                        {
                                            required: true,
                                            message: `Интерес!`,
                                        },
                                    ]}
                                >
                                    <Input
                                        placeholder={"Интерес"}
                                        name="interest"
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
    return {
    }
}

export default connect(mapStateToProps)(ModalForm);