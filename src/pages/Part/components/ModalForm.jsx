import React from 'react';
import {connect} from "react-redux";
import {Modal, Button, Form, Input, message, Row, Col} from 'antd';
import {EditOutlined, PlusOutlined} from '@ant-design/icons';

import "../../pages.scss";
import {createPart, updatePart} from "../../../server/config/admin/Part";

const initialParams = {
    nameRu: null,
    nameUz: null,
    moduleId: localStorage.getItem("moduleId")
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
        this.setState({isSubmitting: true}, () => {

            if (this.props.edit) {
                const objId = objToSend.id;
                delete objToSend.id;
                updatePart(objId, objToSend).then((res) => {
                    if (res) {
                        message.success('Success');
                    }

                    this.setState({isSubmitting: false, visible: false});
                    this.props.getList();
                    this.currentForm.current.setFieldsValue(initialParams);
                })
            } else {
                console.log(objToSend)
                createPart(objToSend).then((res) => {
                    if (res) {
                        message.success('Success');
                    }

                    this.setState({isSubmitting: false, visible: false});
                    this.props.getList();
                    this.currentForm.current.setFieldsValue(initialParams);
                }).catch(
                    function (error) {
                        // return Promise.reject(error)
                    })
            }
        });
    };

    handleCheckboxChange = (e) => {
        const {name, checked} = e.target;
        this.setState({
            params: {
                ...this.state.params,
                [name]: checked,
            }
        })
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
                    moduleId:localStorage.getItem("moduleId")
                },
            });
        } else {
            this.setState({
                visible: true,
                params: {
                    ...initialParams,
                    moduleId:localStorage.getItem("moduleId")
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
            nameRu,
            nameUz,
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
                            nameRu,
                            nameUz,
                        }}
                    >
                        <Row gutter={[16]}>
                            <Col span={24}>
                                <Form.Item
                                    label={"Русское Название"}
                                    name="nameRu"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Русское Название!',
                                        },
                                    ]}
                                >
                                    <Input
                                        placeholder={'NameRu'}
                                        name="nameRu"
                                        onChange={this.handleInputChange}
                                    />
                                </Form.Item>

                                <Form.Item
                                    label={"Узбекский Название"}
                                    name="nameUz"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Узбекский Название!',
                                        },
                                    ]}
                                >
                                    <Input
                                        placeholder={'NameUz'}
                                        name="nameUz"
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