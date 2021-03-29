import React from 'react';
import {connect} from "react-redux";
import {Modal, Button, Form, Input, Select, message, Row, Col} from 'antd';
import {EditOutlined, PlusOutlined} from '@ant-design/icons';

import "../../pages.scss";
import {createCourse, updateCourse} from "../../../server/config/admin/Course";
import {host, port} from "../../../server/host";
import  CKEditor  from 'ckeditor4-react';

const {Option} = Select;
const initialParams = {
    titleRu: null,
    titleUz: null,
    descriptionRu:null,
    descriptionUz:null,
    lectures: null,
    duration: null,
    status: null,
    hashCode: null,
    teacherId:null,
    categoryId:null,
};

class ModalForm extends React.Component {
    constructor() {
        super();
        this.state = {
            teacher:null,
            category:null,
            visible: false,
            isSubmitting: false,
            params: {...initialParams}
        };
        this.currentForm = React.createRef();
    }

    onFinish = () => {
        const { params } = this.state;
        const objToSend = {
            ...params,
        };
        console.log(objToSend);
        this.setState({isSubmitting: true}, () => {
            if (this.props.edit) {
                const userId = objToSend.id;
                delete objToSend.id;
                updateCourse(userId, objToSend).then((res) => {
                    if (res) {
                        this.setState({isSubmitting: false, visible: false});
                        res.data.success? message.success(res.data.message):message.error(res.data.message);
                    } else {
                        message.success('Request failed!');
                        this.setState({isSubmitting: false, visible: false});
                    }
                    this.props.getList();
                    this.currentForm.current.setFieldsValue(initialParams);
                }).catch(e=>{
                    message.success('Request failed!');
                });
            } else {
                createCourse(objToSend).then((res) => {
                    if (res) {
                        this.setState({isSubmitting: false, visible: false});
                        res.data.success? message.success(res.data.message):message.error(res.data.message);
                    } else {
                        message.success('Request failed!');
                        this.setState({isSubmitting: false, visible: false});
                    }
                    this.props.getList();
                    this.currentForm.current.setFieldsValue(initialParams);
                }).catch(e=>{
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
    dateTimeChangeHandler = (date) => {
        this.setState({
            params: {
                ...this.state.params,
                resultDate: date,
            }
        })
    };

    showModal = () => {
        const {edit} = this.props;

        if (edit) {
            const editingObj = this.props.getObj();
            delete editingObj.updateAt;
            delete editingObj.createAt;
            let teacher = editingObj.teacher?
                (editingObj.teacher.firstName+" "+editingObj.teacher.lastName):'';
            let category = editingObj.category?
                (editingObj.category.nameRu+" "+editingObj.category.nameUz):'';
            let hashCode = editingObj.attachement?
                editingObj.attachement.hashCode:'';
            let teacherId = editingObj.teacher?
                editingObj.teacher.id:'';
            let categoryId = editingObj.category?
                editingObj.category.id:'';
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
    changeCheck=(e)=>{
        this.setState({
            params:{
                ...this.state.params,
                certification: e.target.checked,
            },
        });
    };
    handleCKUChangeRu = (event) => {
        const data = event.editor.getData();
        this.setState({
            params: {
                ...this.state.params,
                descriptionRu: data,
            }
        })
    };
    handleCKUChangeUz = (event) => {
        const data = event.editor.getData();
        this.setState({
            params: {
                ...this.state.params,
                descriptionUz: data,
            }
        })
    };
    render() {
        const {
            isSubmitting,
            teacher,
            category,
        } = this.state;

        const {
            titleRu,
            titleUz,
            descriptionRu,
            descriptionUz,
            lectures,
            duration,
            status,
            hashCode,
            teacherId,
            categoryId,
        } = this.state.params;

        const {edit, teachers, categories} = this.props;

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
                            titleRu,
                            titleUz,
                            descriptionRu,
                            descriptionUz,
                            lectures,
                            duration,
                            status,
                            hashCode,
                            teacherId,
                            categoryId,
                            teacher,
                            category,
                        }}
                    >
                        <Row gutter={[16]}>

                            <Col md={24} lg={12}>
                                <Form.Item
                                    label={"Название курса (Русский)"}
                                    name="titleRu"
                                    rules={[
                                        {
                                            required: true,
                                            message: `Название курса (Русский)!`,
                                        },
                                    ]}
                                >
                                    <Input
                                        placeholder={"Название курса (Русский)"}
                                        name="titleRu"
                                        onChange={this.handleInputChange}
                                    />
                                </Form.Item>

                                <Form.Item
                                    label={"Название курса (узбек)"}
                                    name="titleUz"
                                    rules={[
                                        {
                                            required: true,
                                            message: `Название курса (узбек)!`,
                                        },
                                    ]}
                                >
                                    <Input
                                        placeholder={"Название курса (узбек)"}
                                        name="titleUz"
                                        onChange={this.handleInputChange}
                                    />
                                </Form.Item>

                                <Form.Item
                                    label={" Лекции"}
                                    name="lectures"
                                    rules={[
                                        {
                                            required: false,
                                            message: `Лекции!`,
                                        },
                                    ]}
                                >
                                    <Input
                                        placeholder={"Лекции"}
                                        name="lectures"
                                        onChange={this.handleInputChange}
                                    />
                                </Form.Item>
                                <Form.Item
                                    label={"Учитель"}
                                    name="teacher"
                                    rules={[
                                        {
                                            required: true,
                                            message: `Учитель!`,
                                        },
                                    ]}
                                >
                                    <Select
                                        showSearch
                                        placeholder={"Учитель"}
                                        onChange={(value) => this.handleSelectChange('teacherId', value)}
                                    >
                                        {
                                            Array.isArray(teachers) ? teachers.map((role) => (
                                                <Option value={role.id} key={role.id}>
                                                    {role['firstName']+" "+role['lastName']}
                                                </Option>
                                            )) : ''
                                        }
                                    </Select>
                                </Form.Item>
                            </Col>

                            <Col md={24} lg={12}>
                                <Form.Item
                                    label={"status"}
                                    name="status"
                                    rules={[
                                        {
                                            required: true,
                                            message: `status!`,
                                        },
                                    ]}
                                >
                                    <Select
                                        showSearch
                                        placeholder={"status"}
                                        // mode="multiple"
                                        onChange={(value) => this.handleSelectChange('status', value)}
                                    >

                                        <Option value="DISABLE" key={1}>
                                            DISABLE
                                        </Option>

                                        <Option value="ACTIVE" key={2}>
                                            ACTIVE
                                        </Option>
                                    </Select>

                                </Form.Item>

                                <Form.Item
                                    label={"Продолжительность"}
                                    name="duration"
                                    rules={[
                                        {
                                            required: true,
                                            message: `Продолжительность!`,
                                        },
                                    ]}
                                >
                                    <Input
                                        type={"number"}
                                        placeholder={"Продолжительность"}
                                        name="duration"
                                        onChange={this.handleInputChange}
                                    />
                                </Form.Item>

                                <Form.Item
                                    label={edit ? (<a target='_blank'
                                                      href={`${host}:${port}` + '/api/client/file/preview/' + hashCode}>
                                        Изображение учителя</a>) : 'Хэш-коды файлов'}
                                    name="hashCode"
                                    rules={[
                                        {
                                            required: true,
                                            message: `Хэш-коды Изображение!`,
                                        },
                                    ]}
                                >
                                    <Input
                                        placeholder={"Хэш-коды Изображение"}
                                        name="hashCode"
                                        onChange={this.handleInputChange}
                                    />
                                </Form.Item>

                                <Form.Item
                                    label={"Категория"}
                                    name="category"
                                    rules={[
                                        {
                                            required: true,
                                            message: `Категория!`,
                                        },
                                    ]}
                                >
                                    <Select
                                        showSearch
                                        placeholder={"Категория"}
                                        onChange={(value) => this.handleSelectChange('categoryId', value)}
                                    >
                                        {
                                            Array.isArray(categories) ? categories.map((role) => (
                                                <Option value={role.id} key={role.id}>
                                                    {role['nameRu']+"/"+role['nameUz']}
                                                </Option>
                                            )) : ''
                                        }
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>


                        <Row gutter={[16]}>
                            <Col md={24} lg={24}>
                                <Form.Item
                                    label={"Описание курса (русский)"}
                                    name="descriptionRu"
                                    rules={[
                                        {
                                            required: true,
                                            message: `Описание курса (русский)!`,
                                        },
                                    ]}
                                >
                                    <CKEditor
                                        style={{minHeight: "400px"}}
                                        config={{
                                            allowedContent :true,
                                            extraPlugins : 'autogrow,sourcedialog',
                                            removePlugins : 'sourcearea'
                                        }}
                                        data={(descriptionRu===null)?"<p>ZAKO Описание курса (русский)</p>":descriptionRu}
                                        onChange={this.handleCKUChangeRu}
                                    />
                                </Form.Item>

                                <Form.Item
                                    label={"Описание курса (узбек)"}
                                    name="descriptionUz"
                                    rules={[
                                        {
                                            required: true,
                                            message: `Описание курса (узбек)!`,
                                        },
                                    ]}
                                >
                                    <CKEditor
                                        style={{minHeight: "400px"}}
                                        config={{
                                            allowedContent :true,
                                            extraPlugins : 'autogrow,sourcedialog',
                                            removePlugins : 'sourcearea'
                                        }}
                                        data={(descriptionUz===null)?"<p>ZAKO Описание курса (узбекский)</p>":descriptionUz}
                                        onChange={this.handleCKUChangeUz}
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
};

export default connect(mapStateToProps)(ModalForm);