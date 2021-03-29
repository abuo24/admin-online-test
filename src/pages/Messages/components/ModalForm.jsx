import React from 'react';
import { connect } from "react-redux";
import { Modal, Button, Form, Input, message, Row, Col} from 'antd';
import { EditOutlined} from '@ant-design/icons';

import "../../pages.scss";
import {createMessage} from "../../../server/config/admin/Messages";

const initialParams = {
    fullName: null,
    email: null,
    comment:null,
    subject:null
};
const {TextArea} = Input;

class ModalForm extends React.Component{
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

                createMessage(objToSend).then((res) => {
                    if (res) {
                        message.success('Success');
                    }

                    this.setState({ isSubmitting: false, visible: false });
                    this.props.getList();
                    this.currentForm.current.setFieldsValue(initialParams);
                }).catch(
                    function (error) {
                        console.log(error)
                    })
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
                params: { ...initialParams }
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
            fullName,
            email,
            subject,
            comment
        } = this.state.params;
        const {  edit } = this.props;
        return (
            <React.Fragment>
                {
                    edit ? (
                        <Button onClick={this.showModal} title={"Показать"}>
                            <EditOutlined />
                        </Button>
                    ) : ''
                }
                <Modal
                    centered
                    closable={false}
                    maskClosable={false}
                    title={edit ? "Изменить" :"Добавить новое"}
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
                            fullName,
                            email,
                            subject,
                            comment
                        }}
                    >
                        <Row gutter={[16]}>
                            <Col span={24}>
                                <Form.Item
                                    label={"Полное имя"}
                                    name="fullName"
                                    rules={[
                                        {
                                            required: true,
                                            message:'Полное имя!',
                                        },
                                    ]}
                                >
                                    <Input
                                        placeholder={'Полное имя'}
                                        name="fullName"
                                        onChange={this.handleInputChange}
                                    />
                                </Form.Item>

                                <Form.Item
                                    label={"Эл. адрес"}
                                    name="email"
                                    rules={[
                                        {
                                            required: true,
                                            message:'Эл. адрес',
                                        },
                                    ]}
                                >
                                    <Input
                                        placeholder={'Эл. адрес'}
                                        name="email"
                                        onChange={this.handleInputChange}
                                    />
                                </Form.Item>
                                <Form.Item
                                    label={"Тема"}
                                    name="subject"
                                    rules={[
                                        {
                                            required: true,
                                            message:'Тема',
                                        },
                                    ]}
                                >
                                    <Input
                                        placeholder={'Тема'}
                                        name="subject"
                                        onChange={this.handleInputChange}
                                    />
                                </Form.Item>
                                <Form.Item
                                    label={"Комментарий"}
                                    name="comment"
                                    rules={[
                                        {
                                            required: true,
                                            message:'Комментарий!',
                                        },
                                    ]}
                                >
                                    <TextArea
                                        placeholder={'Комментарий!'}
                                        name="comment"
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
};

export default connect(mapStateToProps)(ModalForm);