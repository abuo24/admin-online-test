import React from 'react';
import {Typography, Row, Col, Menu, Dropdown, Button, Modal } from "antd";
import { Link, withRouter } from "react-router-dom";
import { connect } from 'react-redux';

import { DownOutlined, UserOutlined, LogoutOutlined, ExclamationCircleOutlined } from "@ant-design/icons";

// import HorizontalMenus from "./HorizontalMenus";
import { userAccessTokenName } from "../../../constants";
import { deleteCookie } from "../../../utils/useCookies";

import avatar from "../../../assets/img/no-picture.jpg";

import "../../../index.css";
import {host, port} from "../../../server/host";


// const { Search } = Input;
const { Title } = Typography;
const { confirm } = Modal;


function TopNavbar(props) {
    const {currentUser } = props;

    function handleMenuHandle(e) {
        if (e && e.key) {
            props.history.push(e.key);
        }
    }


    function confirmLogOut() {
        confirm({
            title:"Dasturdan rostdan ham chiqishni xohlaysizmi?",
            icon: <ExclamationCircleOutlined />,
            content: "После выхода из системы вам потребуется повторно ввести пароль.",
            okText: "Выход",
            cancelText: "Отмена",
            centered: true,
            onOk() {
                deleteCookie(userAccessTokenName);
                window.location = "/login"
            },
        });
    }

    return (
        <React.Fragment>
            <Row align="middle" justify="space-between" className="top-navbar">
                <Col flex="100px">
                    <Title level={4}>
                        <Link to='/dashboard'>
                            OnlineTestAdmin
                        </Link>
                    </Title>
                </Col>
                <Col>
                    <Row align="middle">
                        <Col>
                            <div className="profile-img-box">
                                {
                                  currentUser?
                                      (currentUser.hashCode?
                                          (<img src={host+':'+port+'/api/client/file/preview/'+currentUser.hashCode} alt="Img error" />):
                                          (<img src={avatar} alt="Img error" />)):
                                      <img src={avatar} alt="Img error" />

                                }
                            </div>
                        </Col>
                        <Col>
                            <Dropdown
                                overlay={
                                    <Menu>
                                        <Menu.Item key="/dashboard/profile" icon={<UserOutlined />} onClick={handleMenuHandle}>
                                            Профил
                                        </Menu.Item>
                                        <Menu.Item key="child2" onClick={confirmLogOut}>
                                            <LogoutOutlined />
                                            Выход
                                        </Menu.Item>
                                    </Menu>
                                }
                            >
                                <Button type="text">
                                    {currentUser?currentUser.firstName:''}
                                <DownOutlined />
                                </Button>
                            </Dropdown>
                        </Col>
                    </Row>
                </Col>
            </Row>

        </React.Fragment>
    );
}

const mapStateToProps = (state) => {
    return {
        currentUser:state.initial_data.currentUser
    }
}

export default withRouter(connect(mapStateToProps)(TopNavbar));