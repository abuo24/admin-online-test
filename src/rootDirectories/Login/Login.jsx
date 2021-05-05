import React, { useState } from "react";
import { Row, Col, Form, Input, Button, Typography, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";

/* HOST */
import { loginUser } from "../../server/config";

/* FUNCTIONS */
import { setCookie } from "../../utils/useCookies";

/* STYLES */
import "../../index.css";

/* CONSTANTS */
import { userAccessTokenName } from "../../constants";

const { Title } = Typography;

const Login = (props) => {
    const [phoneNumber, setPhoneNumber] = useState(null);
    const [password, setPassword] = useState(null);
    const [isSubmitting, setSubmitting] = useState(false);

    const [loginForm] = Form.useForm();

    const handleUsernameChange = (e) => setPhoneNumber(e.target.value);

    const handlePasswordChange = (e) => setPassword(e.target.value);

    const onFinish = () => {
        setSubmitting(true);

        loginUser({
            phoneNumber,
            password,
        }).then((res) => {
            if (res && res.status === 200 && res.data) {
                setCookie(userAccessTokenName, res.data.token)
                window.location = "/dashboard";
            } else {
                message.error("Something went wrong!")
                loginForm.resetFields();
                setSubmitting(false);
            }
        })
    };

    return (
        <Row justify="center" align="middle" style={{ height: "100vh" }}>
            <Col xs={20} sm={12} md={8} lg={4}>
                <Title level={3} className="text-center">OnlineTestAdmin</Title>

                <Form
                    form={loginForm}
                    name="basic"
                    onFinish={onFinish}
                >
                    <Form.Item
                        name="phoneNumber"
                        rules={[
                            {
                                required: true,
                                message: "Please input your login!",
                            },
                        ]}
                    >
                        <Input
                            autoFocus
                            prefix={<UserOutlined className="site-form-item-icon" />}
                            name="phoneNumber"
                            placeholder="Username"
                            onChange={handleUsernameChange}
                            disabled={isSubmitting}
                        />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: "Please input your password!",
                            },
                        ]}
                    >
                        <Input.Password
                            prefix={<LockOutlined className="site-form-item-icon" />}
                            name="password"
                            placeholder="Password"
                            onChange={handlePasswordChange}
                            disabled={isSubmitting}
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="float-right" disabled={isSubmitting} loading={isSubmitting}>
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </Col>
        </Row>
    )
}

export default Login;