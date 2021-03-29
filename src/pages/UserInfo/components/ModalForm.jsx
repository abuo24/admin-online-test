import React from 'react';
import {connect} from "react-redux";
import {Modal, Button, Form, Input, Select, message, Row, Col, Checkbox} from 'antd';
import {EditOutlined, PlusOutlined} from '@ant-design/icons';

import "../../pages.scss";
import {getCoursesWithCategoryId} from "../../../server/config/admin/Course";
import {getModule} from "../../../server/config/admin/Module";
import {
    createPayment,
    createPaymentDetail, getPaymentById, getPaymentDetail,
    updatePayment,
    updatePaymentDetail
} from "../../../server/config/admin/UserInfo";

const {Option} = Select;
const {TextArea} = Input;
const initialParams = {
    userId: localStorage.getItem("userId"),
    courseId: null,
    modules: [],
    categoryId: null,
};
const initialParamDetails = {
    paymentId: null,
    cardNumber: null,
    commissionSum: null,
    exp: null,
    sum: null,
    transferId: null,
};

class ModalForm extends React.Component {
    constructor() {
        super();
        this.state = {
            courses: [],
            category: null,
            course: null,
            allModules: [],
            courseModules: [],
            defaultModules: [],
            visible: false,
            isSubmitting: false,
            params: {...initialParams},
            details: {...initialParamDetails}
        };
        // this.currentForm = React.createRef();
    }

    onFinish = () => {
        const {params} = this.state;
        const objToSend = {
            ...params,
        };
        console.log(objToSend);
        this.setState({isSubmitting: true}, () => {
            if (this.props.edit) {
                const paymentId = objToSend.id;
                delete objToSend.id;
                updatePayment(paymentId, objToSend).then((res) => {
                    if (res) {
                        // this.setState({isSubmitting: false, visible: false});
                        if (res.data.success) {
                            const {details} = this.state;
                            const objToSend = {
                                ...details,
                            };
                            const paymentDetailId = objToSend.id;
                            delete objToSend.id;
                            objToSend.paymentId = paymentId;
                            updatePaymentDetail(paymentDetailId, objToSend).then((res) => {
                                if (res) {
                                    this.setState({isSubmitting: false, visible: false});
                                    res.data.success ? message.success(res.data.message) : message.error(res.data.message);
                                } else {
                                    message.success('Request failed!');
                                    this.setState({isSubmitting: false, visible: false});
                                }
                                // this.props.getList();
                                // this.currentForm.current.setFieldsValue(initialParams);
                            })
                        } else {
                            message.error(res.data.message);
                        }
                    } else {
                        message.success('Request failed!');
                        this.setState({isSubmitting: false, visible: false});
                    }
                    // this.props.getList();
                    // this.currentForm.current.setFieldsValue(initialParams);
                }).catch(e => {
                    message.success('Request failed!');
                });
            } else {
                console.log(objToSend);
                createPayment(objToSend).then((res) => {
                    if (res) {
                        this.setState({isSubmitting: false, visible: false});
                        if (res.data.success) {
                            const {details} = this.state;
                            const objToSend = {
                                ...details,
                            };
                            objToSend.paymentId = parseInt(res.data.message);
                            console.log(objToSend)
                            createPaymentDetail(objToSend).then((res) => {
                                if (res) {
                                    this.setState({isSubmitting: false, visible: false});
                                    res.data.success ? message.success(res.data.message) : message.error(res.data.message);
                                } else {
                                    message.success('Request failed!');
                                    this.setState({isSubmitting: false, visible: false});
                                }
                                // this.props.getList();
                                // this.currentForm.current.setFieldsValue(initialParams);
                            })
                        } else {
                            message.error(res.data.message);
                        }
                    } else {
                        message.success('Request failed!');
                        this.setState({isSubmitting: false, visible: false});
                    }
                    // this.props.getList();
                    // this.currentForm.current.setFieldsValue(initialParams);
                }).catch(e => {
                    message.success('Request failed!');
                });
            }
        });
    };
    handleInputChange = (e) => {
        const {name, value} = e.target;
        this.setState({
            details: {
                ...this.state.details,
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
            }, () => this.getList())
        }
    };
    showModal = () => {
        const {edit} = this.props;
        if (edit) {
            const editingObj = this.props.getObj();
            let paymentId = editingObj.id;
            getPaymentById(paymentId).then(res => {
                if (res) {
                    const editingObj = res.data;
                    let category =
                        (editingObj.course.category.nameRu + '/' + editingObj.course.category.nameUz);
                    let course = editingObj.course ? (editingObj.course.titleRu) : '';
                    let defaultModules = [];
                    editingObj.modules.map(item => {
                        defaultModules.push(item.id);
                    });
                    let obj = {
                        id: editingObj.id,
                        courseId: editingObj.course ? (editingObj.course.id) : '',
                        modules: editingObj.modules,
                        categoryId: editingObj.category ? (editingObj.category.id) : ''
                    };
                    getPaymentDetail(paymentId).then(res => {
                        if (res) {
                            const editingObj = res.data;
                            delete editingObj.createAt;
                            delete editingObj.updateAt;
                            this.setState({
                                category,
                                course,
                                defaultModules,
                                details: {
                                    ...this.state.details,
                                    ...editingObj,
                                    paymentId
                                },
                                params: {
                                    ...this.state.params,
                                    ...obj,
                                    userId: localStorage.getItem("userId")
                                },
                                visible: true
                            }, () => this.getList())
                        } else {
                            this.setState({
                                category,
                                course,
                                defaultModules,
                                params: {
                                    ...this.state.params,
                                    ...obj,
                                    userId: localStorage.getItem("userId")
                                },
                                visible: true,
                            });
                        }
                    });
                } else {
                    this.setState({
                        visible: true,
                    });
                }
            });
        } else {
            this.setState({
                visible: true,
                params: {
                    ...initialParams,
                    userId: localStorage.getItem("userId")
                },
            });
        }
    };

    handleCancel = () => {
        this.setState({
            visible: false,
        })
    };

    getList = () => {
        const {categoryId, courseId} = this.state.params;
        if (categoryId !== null) {
            getCoursesWithCategoryId(categoryId).then(res => {
                if (res && Array.isArray(res.data))
                    this.setState({
                        courses: res.data
                    })
            })
        }
        ;
        if (courseId !== null) {
            getModule(courseId).then(res => {
                let courseModules = [];
                if (res && Array.isArray(res.data))
                    res.data.map(function (item) {
                        let obj = {
                            label: item.nameRu,
                            value: item.id
                        };
                        courseModules.push(obj);
                    });
                this.setState({
                    courseModules,
                    allModules: res.data
                })
            })
        }
        ;
    };

    componentDidMount() {
        this.getList();
    };

    onChange = (checkedValues) => {
        const {allModules, params} = this.state;
        let arrayModules = [];
        checkedValues.map((checkVal) => {
            arrayModules.push(allModules.filter(module => module.id === checkVal)[0])
        });
        this.setState({
            params: {
                ...params,
                modules: arrayModules
            }
        })
    };

    render() {
        const {
            userId,
            courseId,
            modules,
            categoryId,
        } = this.state.params;
        const {
            paymentId,
            cardNumber,
            commissionSum,
            exp,
            sum,
            transferId,
        } = this.state.details;
        const {
            isSubmitting,
            courses,
            courseModules,
            category,
            course,
            defaultModules
        } = this.state;
        const {edit, categories} = this.props;

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
                    width={600}
                    className="lms-form"
                >
                    <Form
                        name="basic"
                        layout="vertical"
                        onFinish={this.onFinish}
                        ref={this.currentForm}
                        initialValues={{
                            userId,
                            courseId,
                            modules,
                            categoryId,
                            paymentId,
                            category,
                            course,
                            cardNumber,
                            commissionSum,
                            exp,
                            sum,
                            transferId,
                        }}
                    >
                        <Row gutter={[16]}>
                            <Col md={24} lg={12}>
                                <Form.Item
                                    label={"Категории"}
                                    name="category"
                                    rules={[
                                        {
                                            required: true,
                                            message: `Категории!`,
                                        },
                                    ]}
                                >
                                    <Select
                                        showSearch
                                        placeholder={"Категории"}
                                        onChange={(value) => this.handleSelectChange('categoryId', value)}
                                    >
                                        {
                                            Array.isArray(categories) ? categories.map((role) => (
                                                <Option value={role.id} key={role.id}>
                                                    {role['nameRu'] + "/" + role['nameUz']}
                                                </Option>
                                            )) : ''
                                        }
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col md={24} lg={12}>
                                <Form.Item
                                    label={"Курсы"}
                                    name="course"
                                    rules={[
                                        {
                                            required: true,
                                            message: `Курсы!`,
                                        },
                                    ]}
                                >
                                    <Select
                                        showSearch
                                        placeholder={"Курсы"}
                                        onChange={(value) => this.handleSelectChange('courseId', value)}
                                    >
                                        {
                                            Array.isArray(courses) ? courses.map((role) => (
                                                <Option value={role.id} key={role.id}>
                                                    {role['titleRu']}
                                                </Option>
                                            )) : ''
                                        }
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={[16]}>
                            <Col md={24} lg={24}>
                                <h4 style={{marginTop: "2%"}}>Модули</h4>
                                <Checkbox.Group options={courseModules} defaultValue={defaultModules}
                                                onChange={this.onChange}/>
                            </Col>
                        </Row>
                        <h4 style={{marginTop: "5%"}}>Детали оплаты</h4>
                        <hr/>
                        <Row gutter={[16]}>
                            <Col md={24} lg={12}>
                                <Form.Item
                                    label={"Номер карты"}
                                    name="cardNumber"
                                >
                                    <Input
                                        placeholder={"Номер карты"}
                                        name="cardNumber"
                                        onChange={this.handleInputChange}
                                    />
                                </Form.Item>
                                <Form.Item
                                    label={"Сумма"}
                                    name="sum"
                                >
                                    <Input
                                        type={"number"}
                                        placeholder={"Сумма"}
                                        name="sum"
                                        onChange={this.handleInputChange}
                                    />
                                </Form.Item>
                                <Form.Item
                                    label={"Сумма комиссии"}
                                    name="commissionSum"
                                >
                                    <Input
                                        type={"number"}
                                        placeholder={"Сумма комиссии"}
                                        name="commissionSum"
                                        onChange={this.handleInputChange}
                                    />
                                </Form.Item>
                            </Col>
                            <Col md={24} lg={12}>
                                <Form.Item
                                    label={"Продолжительность"}
                                    name="exp"
                                >
                                    <Input
                                        placeholder={"exp"}
                                        name="exp"
                                        onChange={this.handleInputChange}
                                    />
                                </Form.Item>
                                <Form.Item
                                    label={"Id передачи"}
                                    name="transferId"
                                >
                                    <Input
                                        placeholder={"Id передачи"}
                                        name="transferId"
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
};

export default connect(mapStateToProps)(ModalForm);