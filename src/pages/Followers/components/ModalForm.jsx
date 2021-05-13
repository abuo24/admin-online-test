import React from 'react';
import { connect } from "react-redux";
import { Modal, Button, Form, Input, Select, message, Row, Col} from 'antd';
import { EditOutlined, PlusOutlined } from '@ant-design/icons';

import "../../pages.scss";
import {createFollower, updateFollower} from "../../../server/config/admin/Followers";
import {getCourses} from "../../../server/config/admin/Course";
import {Option} from "antd/lib/mentions";

const initialParams = {
    name: null,
    code: null,
    subjectFirst: null,
    subjectSecond: null,
    subjectThird: null
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
                        res.data.succes? message.success(res.data.message):message.error(res.data.message);
                    } else {
                        this.setState({ isSubmitting: false, visible: false });
                    }
                    this.props.getList();
                }).catch(e=>{
                    message.error('Request failed!');
                })
            } else {
                createFollower(objToSend).then((res) => {
                    if (res) {
                        this.setState({ isSubmitting: false, visible: false });
                        res.data.succes? message.success(res.data.message):message.error(res.data.message);
                    } else {
                        this.setState({ isSubmitting: false, visible: false });
                    }
                    this.props.getList();
                    this.currentForm.current.setFieldsValue(initialParams);
                }).catch(e=>{
                    message.error('Request failed!');
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
    handleSelectChange = (name, value) => {
        console.log(value)
        this.setState({
            ...this.state,
            params: {
                ...this.state.params,
                [name]: value,
            }
        })
    };
    handleCancel = () => {
        this.setState({
            visible: false,
        })
    };
    getSubjects = () => {
        getCourses()
            .then(res=>{
                if (res) {
                    this.setState({ isSubmitting: false, visible: false, list: res.data.data });
                    // res.data.data.success? message.success("succes"):message.error(res.data.data.message);
                } else {
                    this.setState({ isSubmitting: false, visible: false });
                }
            })
            .catch(err=>console.log(err))
    }

    componentDidMount() {
        const {edit}=this.props;
        if (edit){
        }
        this.getSubjects();
    }

    render() {
        const {
            isSubmitting,
            list
        } = this.state;

        const {
            name,
            code,
            subjectFirst,
            subjectSecond,
            subjectThird,

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
                            name,
                            code,
                            subjectFirst,
                            subjectSecond,
                            subjectThird
                        }}
                    >
                        <h3>Информация о Hаправления</h3>
                        <Row gutter={[16]}>

                            <Col span={24}>
                                <Form.Item
                                    label={"Hаправления"}
                                    name="name"
                                    rules={[
                                        {
                                            required: true,
                                            message: `Hаправления!`,
                                        },
                                    ]}
                                >
                                    <Input
                                        placeholder={"Hаправления"}
                                        name="name"
                                        onChange={this.handleInputChange}
                                    />
                                </Form.Item>

                                <Form.Item
                                    label={"Kод"}
                                    name="code"
                                    rules={[
                                        {
                                            required: true,
                                            message: `Kод!`,
                                        },
                                    ]}
                                >
                                    <Input
                                        placeholder={"Kод"}
                                        name="code"
                                        onChange={this.handleInputChange}
                                    />
                                </Form.Item>
                                <Form.Item
                                    label={`Первый предмет`}
                                    rules={[
                                        {
                                            required: true,
                                            message: `Первый предмет!`,
                                        },
                                    ]}
                                >
                                    <Select
                                        showSearch
                                        name={"subjectFirst"}
                                        placeholder={`Первый предмет`}
                                        onChange={(value) => this.handleSelectChange(`subjectFirst`, value)}
                                        defaultValue={subjectFirst&&subjectFirst.id?subjectFirst.id:null}
                                    >
                                        {
                                            Array.isArray(list) ? list.map((role) => (
                                                <Option
                                                    value={role.id} key={role.id}>
                                                    {role['nameRu'] + "/" + role['nameUz']}
                                                </Option>
                                            )) : ''
                                        }
                                    </Select>

                                </Form.Item>  <Form.Item
                                    label={`Второй предмет`}
                                    rules={[
                                        {
                                            required: true,
                                            message: `Второй предмет!`,
                                        },
                                    ]}
                                >
                                    <Select
                                        showSearch
                                        name={"subjectSecond"}
                                        placeholder={`Второй предмет`}
                                        defaultValue={subjectSecond&&subjectSecond.id?subjectSecond.id:null}
                                        onChange={(value) => this.handleSelectChange(`subjectSecond`, value)}
                                    >
                                        {
                                            Array.isArray(list) ? list.map((role) => (
                                                <Option
                                                    // disabled={id === role.id || subjectsId.find(i => i === role.id) != null}
                                                    value={role.id} key={role.id}>
                                                    {role['nameRu'] + "/" + role['nameUz']}
                                                </Option>
                                            )) : ''
                                        }
                                    </Select>

                                </Form.Item><Form.Item
                                    label={`Третий предмет`}
                                    rules={[
                                        {
                                            required: true,
                                            message: `Третий предмет!`,
                                        },
                                    ]}
                                >
                                    <Select
                                        showSearch
                                        name={"subjectThird"}
                                        placeholder={`Третий предмет`}
                                        onChange={(value) => this.handleSelectChange(`subjectThird`, value)}
                                        defaultValue={subjectSecond&&subjectSecond.id?subjectSecond.id:null}
                                    >
                                        {
                                            Array.isArray(list) ? list.map((role) => (
                                                <Option
                                                    // disabled={id === role.id || subjectsId.find(i => i === role.id) != null}
                                                    value={role.id} key={role.id}>
                                                    {role['nameRu'] + "/" + role['nameUz']}
                                                </Option>
                                            )) : ''
                                        }
                                    </Select>

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