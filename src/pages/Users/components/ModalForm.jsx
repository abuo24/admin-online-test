import React from 'react';
import {connect} from "react-redux";
import {Modal, Button, Form, Input, message, Row, Col, Checkbox, Select} from 'antd';
import {EditOutlined, PlusOutlined} from '@ant-design/icons';

import {host, port} from "../../../server/host";

import "../../pages.scss";
import {createUsers, updateUsers} from "../../../server/config/admin/Users";
import {Option} from "antd/lib/mentions";

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
                (updateUsers(userId, objToSend).then((res) => {
                    if (res) {
                        res.data.succes ? message.success(res.data.message) : message.error(res.data.message);
                    }
                    this.setState({isSubmitting: false, visible: false});
                    this.props.getList();
                    console.log(initialParams);
                }).catch(e => {
                    message.error('Request failed!');
                }))
            } else {
                console.log(objToSend);
                (createUsers(objToSend).then((res) => {
                    if (res) {
                        res.data.succes ? message.success(res.data.message) : message.error(res.data.message);
                    }
                    this.setState({isSubmitting: false, visible: false});
                    this.props.getList();
                    this.currentForm.current.setFieldsValue(initialParams);
                }).catch(e => {
                    message.error('Request failed!');
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
            let hashCode = editingObj.attachment ? editingObj.attachment.hashCode : '';
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
                        <Button onClick={this.showModal} title={"????????????????"}>
                            <EditOutlined/>
                        </Button>
                    ) : (
                        <Button type="primary" onClick={this.showModal} title={"???????????????? ??????????"}>
                            <PlusOutlined/>
                        </Button>
                    )
                }
                <Modal
                    centered
                    closable={false}
                    maskClosable={false}
                    title={edit ? "????????????????" : "???????????????? ??????????"}
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
                        <h3>{"???????????????????? ?? ??????????????"}</h3>
                        <Row gutter={[16]}>
                            <Col span={12}>

                                <Form.Item
                                    label={"??????"}
                                    name="first_name"
                                    rules={[
                                        {
                                            required: true,
                                            message: `??????!`,
                                        },
                                    ]}
                                >
                                    <Input
                                        placeholder={"??????"}
                                        name="first_name"
                                        onChange={this.handleInputChange}
                                    />
                                </Form.Item>
                                <Form.Item
                                    label={"??????????????"}
                                    name="last_name"
                                    rules={[
                                        {
                                            required: true,
                                            message: `??????????????!`,
                                        },
                                    ]}
                                >
                                    <Input
                                        placeholder={"??????????????"}
                                        name="last_name"
                                        onChange={this.handleInputChange}
                                    />
                                </Form.Item>
                                <Form.Item
                                    label={"???????????????????? ??????????"}
                                    name="phoneNumber"
                                    rules={[
                                        {
                                            required: true,
                                            message: `???????????????????? ??????????!`,
                                        },
                                    ]}
                                >
                                    <Input
                                        placeholder={"???????????????????? ??????????"}
                                        name="phoneNumber"
                                        onChange={this.handleInputChange}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    label={"??????????"}
                                    name="password"
                                    rules={[
                                        {
                                            message: `??????????!`,
                                        },
                                    ]}
                                >
                                    <Input.Password
                                        placeholder={"??????????"}
                                        name="password"
                                        onChange={this.handleInputChange}
                                    />
                                </Form.Item>
                                {/*<Form.Item*/}
                                {/*    label={"???????????????? ????????????"}*/}
                                {/*    name="correct"*/}
                                {/*    rules={[*/}
                                {/*        {*/}
                                {/*            required: true,*/}
                                {/*            message: `???????????????? ????????????!`,*/}
                                {/*        },*/}
                                {/*    ]}*/}
                                {/*>*/}
                                    {/*<Select*/}
                                    {/*    showSearch*/}
                                    {/*    placeholder={"???????????????? ????????????"}*/}
                                    {/*    onChange={(item) => {*/}
                                    {/*        this.handleSelectChange('groupId', item)*/}
                                    {/*    }}*/}
                                    {/*    // defaultValue={mas.indexOf(correctAnswerId) + 1}*/}
                                    {/*>*/}
                                    {/*    {*/}
                                    {/*        Array.from(Array(4).keys()).map((role) => (*/}
                                    {/*            <Option value={role + 1}*/}
                                    {/*                    key={role + 1}>*/}
                                    {/*                {role + 1}*/}
                                    {/*            </Option>*/}
                                    {/*        ))*/}
                                    {/*    }*/}
                                    {/*</Select>*/}
                                {/*</Form.Item>*/}
                            </Col>
                        </Row>
                        <Row className="form-footer" justify="end" gutter={[8]}>
                            <Col>
                                <Form.Item>
                                    <Button onClick={this.handleCancel} disabled={isSubmitting}>
                                        ????????????
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