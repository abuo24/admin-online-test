import React from 'react';
import { connect } from "react-redux";
import { Modal, Button, Form, Input, message, Row, Col} from 'antd';

import "../../pages.scss";
import {createAddress, getAddress, updateAddress} from "../../../server/config/admin/UserInfo";

const initialParams = {
    district: null,
    home: null,
    id:null,
    region:null,
    street:null,
    userId:localStorage.getItem("userId")
};

class ModalForm extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            isSubmitting: false,
            params: { ...initialParams }
        };
        // this.currentForm = React.createRef();
    }

    onFinish = () => {
        const { params } = this.state;
        const objToSend = {
            ...params,
        };
        let addressId=objToSend.id;
        if (addressId===null) {
            this.setState({isSubmitting: true}, () => {
                createAddress(objToSend).then((res) => {
                    if (res) {
                        message.success('Success');
                    }
                    this.setState({isSubmitting: false}, () => this.props.showModal(false));
                    // this.currentForm.current.setFieldsValue(initialParams);
                }).catch(
                    function (error) {
                        console.log(error)
                    })
            });
        }else{
            delete objToSend.id;
            this.setState({isSubmitting: true}, () => {
                updateAddress(addressId, objToSend).then((res) => {
                    if (res) {
                        message.success('Success');
                    }
                    this.setState({isSubmitting: false}, () => this.props.showModal(false));
                    // this.currentForm.current.setFieldsValue(initialParams);
                }).catch(
                    function (error) {
                        console.log(error)
                    })
            });
        }
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

    getList = () => {
        getAddress(localStorage.getItem("userId")).then(res=>{
            console.log(res);
            if (res) {
                this.setState({
                    params: {
                        ...initialParams,
                        ...res.data,
                    },
                });
            }else {
                this.setState({
                    params: {
                        ...initialParams,
                    },
                });
            }
        });
    };
    componentDidMount=()=>{
        this.getList();
    };

    render() {
        const {
            isSubmitting,
        } = this.state;

        const {
            district,
            home,
            region,
            street,
        } = this.state.params;
        console.log(this.state.params);
        const {  edit, visible } = this.props;
        return (
            <React.Fragment>
                <Modal
                    centered
                    closable={false}
                    maskClosable={false}
                    title={"Информация о пользователе"}
                    visible={visible}
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
                            district,
                            home,
                            region,
                            street,
                        }}
                    >
                        <Row gutter={[16]}>
                            <Col span={24}>
                                <Form.Item
                                    label={"Область"}
                                    name="region"
                                >
                                    <Input
                                        placeholder={'Область'}
                                        name="region"
                                        onChange={this.handleInputChange}
                                    />
                                </Form.Item>
                                <Form.Item
                                    label={"Округ"}
                                    name="district"
                                >
                                    <Input
                                        placeholder={'Округ'}
                                        name="district"
                                        onChange={this.handleInputChange}
                                    />
                                </Form.Item>

                                <Form.Item
                                    label={"улица"}
                                    name="street"
                                >
                                    <Input
                                        placeholder={'улица'}
                                        name="street"
                                        onChange={this.handleInputChange}
                                    />
                                </Form.Item>
                                <Form.Item
                                    label={"Дома"}
                                    name="home"
                                >
                                    <Input
                                        placeholder={'Дома'}
                                        name="home"
                                        onChange={this.handleInputChange}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row className="form-footer" justify="end" gutter={[8]}>
                                <Col>
                                    <Form.Item>
                                        <Button onClick={()=>this.props.showModal(false)} disabled={isSubmitting}>
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
};

export default connect(mapStateToProps)(ModalForm);