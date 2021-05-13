import React from 'react';
import {connect} from "react-redux";
import {Modal, Button, Form, Input, Select, message, Row, Col} from 'antd';
import {EditOutlined, PlusOutlined} from '@ant-design/icons';

import "../../pages.scss";
import {fileUpload} from "../../../server/config/admin/File";

const {Option} = Select;
const {TextArea} = Input;

const initialParams = {
    hashCode:null,
    auth:null
};

class ModalForm extends React.Component {
    constructor() {
        super();
        this.state = {
            file:null,
            authValue:null,
            visible: false,
            isSubmitting: false,
            params: {...initialParams}
        };
        this.currentForm = React.createRef();
    }
    handleInputChange = (e) => {
        const {name, value} = e.target;
        this.setState({
            params: {
                ...this.state.params,
                [name]: value,
            }
        });
    };

    showModal = () => {
        const {edit} = this.props;

        if (edit) {
            const editingObj = this.props.getObj();
            delete editingObj.updateAt;
            delete editingObj.createAt;
            this.setState({
                visible: true,
                authValue:editingObj.auth?"AUTH":"SECRET",
                params: {
                    hashCode:editingObj.hashCode,
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
    onFormSubmit=(e)=>{
        e.preventDefault();
        const{auth}=this.state.params;
        this.setState({isSubmitting: true}, () => {
                fileUpload(this.state.file, auth).then((response) => {
                    this.setState({
                        isSubmitting: false,
                        visible: false,
                        params: {
                            hashCode: response.data.message
                        },
                    });
                    this.props.getList();
                    this.currentForm.current.setFieldsValue(initialParams);
                    response.data.succes? message.success('Save successful'):message.error('Save failed');
                }).catch(e => {
                    message.error("Request failed!");
                })
        });
    };
    onChange=(e)=> {
        this.setState({file:e.target.files[0]})
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
    render() {
        const {
            isSubmitting,
            authValue,
            file
        } = this.state;
        const {
            hashCode,
            auth
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
                    width={600}
                    className="lms-form"
                >
                    <Form
                        name="basic"
                        layout="vertical"
                        ref={this.currentForm}
                        initialValues={{
                            hashCode,
                            authValue
                        }}
                    >
                        <Row gutter={[16]}>
                            <Col span={24}>
                                <Form.Item
                                    label="File Upload"
                                >
                                    <Input type="file" onChange={this.onChange} />
                                    <br/>
                                    {/*<Button onClick={this.onFormSubmit}>Загрузить</Button>*/}
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
                                    <Button type="primary" htmlType="submit"  onClick={this.onFormSubmit} loading={isSubmitting}>
                                        Загрузить
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