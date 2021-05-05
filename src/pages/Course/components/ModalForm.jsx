import React from 'react';
import {connect} from "react-redux";
import {Modal, Button, Form, Input, Select, message, Row, Col} from 'antd';
import {EditOutlined, PlusOutlined} from '@ant-design/icons';

import "../../pages.scss";
import {createCourse, updateCourse} from "../../../server/config/admin/Course";
import {host, port} from "../../../server/host";
import CKEditor from 'ckeditor4-react';
import {getSubjectById} from "../../../server/config/admin/Category";

const {Option} = Select;
const initialParams = {
    nameUz: null,
    nameRu: null,
    parentsFirst: null,
    parentsSecond: null,
    subjects: []
};

class ModalForm extends React.Component {
    constructor() {
        super();
        this.state = {
            teacher: null,
            category: null,
            parentsSecond: [],
            parentsFirst: [],
            visible: false,
            isSubmitting: false,
            params: {...initialParams}
        };
        this.currentForm = React.createRef();
    }

    onFinish = () => {
        const {params, parentsFirst, parentsSecond} = this.state;
        const objToSend = {
            ...params,
            parentsFirst,
            parentsSecond
        };
        console.log(objToSend);
        this.setState({isSubmitting: true}, () => {
            if (this.props.edit) {
                const userId = objToSend.id;
                delete objToSend.id;
                console.log(objToSend);
                console.log(this.state);
                updateCourse(userId, objToSend).then((res) => {
                    if (res) {
                        this.setState({isSubmitting: false, visible: false});
                        res.data.success ? message.success(res.data.message) : message.error(res.data.message);
                    } else {
                        message.success('Request failed!');
                        this.setState({isSubmitting: false, visible: false});
                    }
                    this.props.getList();
                    this.currentForm.current.setFieldsValue(initialParams);
                }).catch(e => {
                    message.success('Request failed!');
                });
            } else {
                createCourse(objToSend).then((res) => {
                    if (res) {
                        this.setState({isSubmitting: false, visible: false});
                        res.data.success ? message.success(res.data.message) : message.error(res.data.message);
                    } else {
                        message.success('Request failed!');
                        this.setState({isSubmitting: false, visible: false});
                    }
                    this.props.getList();
                    this.currentForm.current.setFieldsValue(initialParams);
                }).catch(e => {
                    message.success('Request failed!');
                });
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
        });
    };

    handleSelectChange = (name, value, item = null) => {
        if (name) {
            if (name === "subjectsId") {
                this.setState({
                    parentsFirst: value
                })
            }
            if (item == null) {
                this.setState({
                    params: {
                        ...this.state.params,
                        [name]: value,
                    }
                })
            } else {
                if (this.state.parentsFirst.find(i => item) != null) {
                    if (this.state.parentsSecond.find(i => i.id === item) === null) {
                        console.log(this.state.parentsSecond.find(i => i.id === item))

                        this.setState({
                            parentsSecond: [
                                ...this.state.parentsSecond,
                                {
                                    id: item,
                                    children: value
                                }
                            ]
                        })
                    } else {
                        // this.state.parentsSecond.remove(this.state.parentsSecond.find(i => i.id === item))
                        let filtered = this.state.parentsSecond.filter(function (el) {
                            return el.id !== item;
                        });
                        this.setState({
                            parentsSecond: [
                                ...filtered,
                                {
                                    id: item,
                                    children: value
                                }
                            ]
                        })
                    }
                }
            }
        }
    };
    dateTimeChangeHandler = (date) => {
        this.setState({
            params: {
                ...this.state.params,
                resultDate: date
            }
        })
    };

    showModal = () => {
        const {edit} = this.props;

        if (edit) {
            const editingObj = this.props.getObj();
            delete editingObj.updateAt;
            delete editingObj.createAt;
            let teacher = editingObj.teacher ?
                (editingObj.teacher.firstName + " " + editingObj.teacher.lastName) : '';
            let category = editingObj.category ?
                (editingObj.category.nameRu + " " + editingObj.category.nameUz) : '';
            let hashCode = editingObj.attachement ?
                editingObj.attachement.hashCode : '';
            let teacherId = editingObj.teacher ?
                editingObj.teacher.id : '';
            let categoryId = editingObj.category ?
                editingObj.category.id : '';
            this.setState({
                visible: true,
                teacher,
                category,
                params: {
                    ...editingObj,
                    hashCode,
                    teacherId,
                    categoryId,
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

    changeCheck = (e) => {
        this.setState({
            params: {
                ...this.state.params,
                certification: e.target.checked,
            },
        });
    };

    render() {
        const {
            isSubmitting,
            teacher,
            category,
        } = this.state;

        const {
            nameUz,
            nameRu,
            descriptionRu,
            descriptionUz,
            lectures,
            parentsFirst,
            duration,
            status,
            hashCode,
            id,
            teacherId, subjectsId,
            categoryId,
        } = this.state.params;

        const {edit, teachers, getList, list, categories} = this.props;
        let mas = []
        parentsFirst && parentsFirst.map(i => {
            mas.push(i.id)
        })


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
                            nameUz,
                            nameRu,
                            parentsFirst
                            // descriptionRu,
                            // descriptionUz,
                            // lectures,
                            // duration,
                            // status,
                            // hashCode,
                            // teacherId,
                            // categoryId,
                            // teacher,
                            // category,
                        }}
                    >
                        <Row gutter={[16]}>

                            <Col md={24} lg={12}>
                                <Form.Item
                                    label={"Название курса (Русский)"}
                                    name="nameRu"
                                    rules={[
                                        {
                                            required: true,
                                            message: `Название курса (Русский)!`,
                                        },
                                    ]}
                                >
                                    <Input
                                        placeholder={"Название курса (Русский)"}
                                        name="nameRu"
                                        onChange={this.handleInputChange}
                                    />
                                </Form.Item>

                                <Form.Item
                                    label={"Название курса (узбек)"}
                                    name="nameUz"
                                    rules={[
                                        {
                                            required: true,
                                            message: `Название курса (узбек)!`,
                                        },
                                    ]}
                                >
                                    <Input
                                        placeholder={"Название курса (узбек)"}
                                        name="nameUz"
                                        onChange={this.handleInputChange}
                                    />
                                </Form.Item>


                                {edit ? <Form.Item
                                    label={"Учитель"}
                                    // name="parentsFirst"
                                    rules={[
                                        {
                                            required: true,
                                            message: `Учитель!`,
                                        },
                                    ]}
                                >
                                    <Select
                                        showSearch
                                        mode={"multiple"}
                                        placeholder={"Блокь 2 предметы"}
                                        onChange={(item) => {
                                            this.handleSelectChange('subjectsId', item)
                                        }}
                                        defaultValue={mas}
                                    >
                                        {
                                            Array.isArray(list) ? list.map((role) => (
                                                <Option
                                                    disabled={id === role.id} value={role.id}
                                                    key={role.id}>
                                                    {role['nameUz'] + " / " + role['nameRu']}
                                                </Option>
                                            )) : ''
                                        }
                                    </Select>
                                </Form.Item> : ""}
                            </Col>

                            <Col md={24} lg={12}>
                                {edit ? subjectsId && subjectsId.map(item => {
                                    let dataSub = list.find(i => i.id === item)
                                    return <Form.Item
                                        label={`Блокь ${dataSub && dataSub.nameRu} предметы`}
                                        rules={[
                                            {
                                                required: true,
                                                message: `Категория!`,
                                            },
                                        ]}
                                    >
                                        <Select
                                            showSearch
                                            mode={"multiple"}
                                            placeholder={`Блокь 3 предметы`}
                                            onChange={(value) => this.handleSelectChange(`categoryId`, value, item)}
                                        >
                                            {
                                                Array.isArray(list) ? list.map((role) => (
                                                    <Option
                                                        disabled={id === role.id || subjectsId.find(i => i === role.id) != null}
                                                        value={role.id} key={role.id}>
                                                        {role['nameRu'] + "/" + role['nameUz']}
                                                    </Option>
                                                )) : ''
                                            }
                                        </Select>

                                    </Form.Item>
                                }) : ""}
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
};

export default connect(mapStateToProps)(ModalForm);