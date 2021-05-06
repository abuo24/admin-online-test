import React from 'react';
import {connect} from "react-redux";
import {Modal, Button, Form, Input, Select, message, Row, Col} from 'antd';
import {EditOutlined, PlusOutlined} from '@ant-design/icons';

import "../../pages.scss";
import {createCourse, updateCourse} from "../../../server/config/admin/Course";
import {host, port} from "../../../server/host";
import CKEditor from 'ckeditor4-react';
import {getSubjectById} from "../../../server/config/admin/Category";
import {createQuestion, updateQuestion} from "../../../server/config/admin/Question";

const {Option} = Select;
const initialParams = {
    nameUz: null,
    nameRu: null,
    correctAnswer: null,
    subject: null,
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
                console.log("tt")
                const id = objToSend.id;
                delete objToSend.id;
                const sendData = {
                    "answers": [
                        {
                            "correct": objToSend.correctId===1,
                            "titleRu": objToSend.answer1Ru,
                            "titleUz": objToSend.answer1Uz
                        },{
                            "correct": objToSend.correctId===2,
                            "titleRu": objToSend.answer2Ru,
                            "titleUz": objToSend.answer2Uz
                        },{
                            "correct": objToSend.correctId===3,
                            "titleRu": objToSend.answer3Ru,
                            "titleUz": objToSend.answer3Uz
                        },{
                            "correct": objToSend.correctId===4,
                            "titleRu": objToSend.answer4Ru,
                            "titleUz": objToSend.answer4Uz
                        }
                    ],
                    "questionRu": objToSend.questionRu,
                    "questionUz": objToSend.questionUz,
                    "subjectId": objToSend.subjectsId
                }
                updateQuestion(id, sendData).then((res) => {
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
                const sendData = {
                    "answers": [
                        {
                            "correct": objToSend.correctId===1,
                            "titleRu": objToSend.answer1Ru,
                            "titleUz": objToSend.answer1Uz
                        },{
                            "correct": objToSend.correctId===2,
                            "titleRu": objToSend.answer2Ru,
                            "titleUz": objToSend.answer2Uz
                        },{
                            "correct": objToSend.correctId===3,
                            "titleRu": objToSend.answer3Ru,
                            "titleUz": objToSend.answer3Uz
                        },{
                            "correct": objToSend.correctId===4,
                            "titleRu": objToSend.answer4Ru,
                            "titleUz": objToSend.answer4Uz
                        }
                    ],
                    "questionRu": objToSend.questionRu,
                    "questionUz": objToSend.questionUz,
                    "subjectId": objToSend.subjectsId
                }
                createQuestion(sendData).then((res) => {
                    if (res) {
                        console.log(res)
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

    handleSelectChange = (name, value) => {
        this.setState({
            params: {
                ...this.state.params,
                [name]: value,
            }
        })
    }
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
        const {edit} = this.props;
        if (edit) {
            this.props.list.includes()
        }

    }

    handleCKUChangeUz = (name, event) => {
        const data = event.editor.getData();
        this.setState({
            params: {
                ...this.state.params,
                [name]: data,
            }
        })
    };

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

        let {
            questionUz,
            questionRu,
            id,
            correctAnswerId,
            subjects,
            answer,
            correctAnswer,
            subject
        } = this.state.params;


        const {edit, courses, teachers, getList, list, categories} = this.props;
        let mas = []
        answer && answer.map(i => {
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
                            questionUz,
                            questionRu,
                            id,
                            correctAnswerId,
                            subjects,
                            answer,
                            correctAnswer,
                            subject
                        }}
                    >
                        <Row gutter={[16]}>
                            <Col md={24} lg={12}>
                                <Form.Item
                                    label={"Название Вопрос (узбек)"}
                                    name="questionUz"
                                    rules={[
                                        {
                                            required: true,
                                            message: `Название Вопрос (узбек)!`,
                                        },
                                    ]}
                                >
                                    <CKEditor
                                        name="questionUz"
                                        type={"classic"}
                                        onChange={e => this.handleCKUChangeUz("questionUz", e)}
                                        data={edit?questionUz:"Название Вопрос (узбек)"}
                                    />
                                </Form.Item>
                            </Col>
                            <Col md={24} lg={12}>
                                <Form.Item
                                    label={"Название Вопрос (русский)"}
                                    name="questionRu"
                                    rules={[
                                        {
                                            required: true,
                                            message: `Название Вопрос (русский)!`,
                                        },
                                    ]}
                                >
                                    <CKEditor
                                        name="questionRu"
                                        type={"classic"}
                                        onChange={e => this.handleCKUChangeUz("questionRu", e)}
                                        data={edit?questionRu:"Название Вопрос (русский)"}
                                    />
                                </Form.Item>
                            </Col>

                            <Col md={24} lg={12}>
                                <Form.Item
                                    label={"Предмет"}
                                    name="subject"
                                    rules={[
                                        {
                                            required: true,
                                            message: `Предмет!`,
                                        },
                                    ]}
                                >
                                    <Select
                                        showSearch
                                        placeholder={"Предмет"}
                                        onChange={(item) => {
                                            this.handleSelectChange('subjectsId', item)
                                        }}
                                        defaultValue={subjects.id}
                                    >
                                        {
                                            Array.isArray(courses) ? courses.map((role) => (
                                                <Option
                                                    disabled={id === role.id} value={role.id}
                                                    key={role.id}>
                                                    {role['nameUz'] + " / " + role['nameRu']}
                                                </Option>
                                            )) : ''
                                        }
                                    </Select>
                                </Form.Item>
                            </Col> <Col md={24} lg={12}>
                            <Form.Item
                                label={"Номер правильного ответа"}
                                name="correct"
                                rules={[
                                    {
                                        required: true,
                                        message: `Номер правильного ответа!`,
                                    },
                                ]}
                            >
                                <Select
                                    showSearch
                                    placeholder={"Номер правильного ответа"}
                                    onChange={(item) => {
                                        this.handleSelectChange('correctId', item)
                                    }}
                                    defaultValue={mas.indexOf(correctAnswerId)+1}
                                >
                                    {
                                        Array.from(Array(4).keys()).map((role) => (
                                            <Option value={role + 1}
                                                    key={role + 1}>
                                                {role + 1}
                                            </Option>
                                        ))
                                    }
                                </Select>
                            </Form.Item>
                        </Col>

                            <Col md={24} lg={24}>
                                <Row gutter={[10]}>
                                    <Col md={24} lg={12}>
                                        <Form.Item
                                            label={"Первый ответ (узбек)"}
                                            name="answer1Uz"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: `Первый ответ (узбек)!`,
                                                },
                                            ]}
                                        >
                                            <CKEditor
                                                name="answer1Uz"
                                                type={"classic"}
                                                onChange={e => this.handleCKUChangeUz("answer1Uz", e)}
                                                data={edit?answer&&answer[0]&&answer[0].titleUz:"Первый ответ (узбек)"}
                                            />
                                        </Form.Item>
                                        <Form.Item
                                            label={"Второй ответ (узбек)"}
                                            name="answer2Uz"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: `Второй ответ (узбек)!`,
                                                },
                                            ]}
                                        >
                                            <CKEditor
                                                name="answer2Uz"
                                                type={"classic"}
                                                onChange={e => this.handleCKUChangeUz("answer2Uz", e)}
                                                data={edit?answer&&answer[1]&&answer[1].titleUz:"Второй ответ (узбек)"}
                                            />

                                        </Form.Item>
                                        <Form.Item
                                            label={"Третий ответ (узбек)"}
                                            name="answer3Uz"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: `Третий ответ (узбек)!`,
                                                },
                                            ]}
                                        >
                                            <CKEditor
                                                name="answer3Uz"
                                                type={"classic"}
                                                onChange={e => this.handleCKUChangeUz("answer3Uz", e)}
                                                data={edit?answer&&answer[2]&&answer[2].titleUz:"Третий ответ (узбек)"}
                                            />
                                        </Form.Item>
                                        <Form.Item
                                            label={"Четвертый ответ (узбек)"}
                                            name="answer4Uz"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: `Четвертый ответ (узбек)!`,
                                                },
                                            ]}
                                        >
                                            <CKEditor
                                                name="answer4Uz"
                                                type={"classic"}
                                                onChange={e => this.handleCKUChangeUz("answer4Uz", e)}
                                                data={edit?answer&&answer[3]&&answer[3].titleUz:"Четвертый ответ (узбек)"}
                                            />

                                        </Form.Item>

                                    </Col>
                                    <Col md={24} lg={12}>
                                        <Form.Item
                                            label={"Первый ответ (русский)"}
                                            name="answer1Ru"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: `Первый ответ (русский)!`,
                                                },
                                            ]}
                                        >
                                            <CKEditor
                                                name="answer1Ru"
                                                type={"classic"}
                                                onChange={e => this.handleCKUChangeUz("answer1Ru", e)}
                                                data={edit?answer&&answer[0]&&answer[0].titleRu:"Первый ответ (русский)"}
                                            />
                                        </Form.Item>
                                        <Form.Item
                                            label={"Второй ответ (русский)"}
                                            name="answer2Ru"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: `Второй ответ (русский)!`,
                                                },
                                            ]}
                                        >
                                            <CKEditor
                                                name="nameUz"
                                                type={"classic"}
                                                onChange={e => this.handleCKUChangeUz("answer2Ru", e)}
                                                data={edit?answer&&answer[1]&&answer[1].titleRu:"Второй ответ (русский)"}
                                            />

                                        </Form.Item>
                                        <Form.Item
                                            label={"Третий ответ (русский)"}
                                            name="answer3Ru"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: `Третий ответ (русский)!`,
                                                },
                                            ]}
                                        >
                                            <CKEditor
                                                name="nameUz"
                                                type={"classic"}
                                                onChange={e => this.handleCKUChangeUz("answer3Ru", e)}
                                                data={edit?answer&&answer[2]&&answer[2].titleRu:"Третий ответ (русский)"}
                                            />
                                        </Form.Item>
                                        <Form.Item
                                            label={"Четвертый ответ (русский)"}
                                            name="answer4Ru"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: `Четвертый ответ (русский)!`,
                                                },
                                            ]}
                                        >
                                            <CKEditor
                                                name="answer4Ru"
                                                type={"classic"}
                                                onChange={e => this.handleCKUChangeUz("answer4Ru", e)}
                                                data={edit?answer&&answer[3]&&answer[3].titleRu:"Четвертый ответ (русский)"}
                                            />

                                        </Form.Item>


                                    </Col>
                                </Row>
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