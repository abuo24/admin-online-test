import React, { useState } from 'react';
import { Row, Col, Divider, Menu, Skeleton } from "antd";
import { Switch, Route, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import Main from "./Main/Main";
import ResetPassword from "./ResetPassword/ResetPassword";

import "./profile.scss";

const Profile = ({ langs, lang, match, location, history, currentUser }) => {
    const [currentMenu, setMenu] = useState(location.pathname);

    const content = langs[lang];

    const menus = [
        {
            path: '/dashboard/profile',
            label: content.menu_profile,
        },
        {
            path: '/dashboard/profile/reset-password',
            label: content.menu_reset_password,
        },
    ]

    return (
        <Row className="bg-white site-border profile">
            <Col xs={24} sm={24} md={8} lg={8}>
                <Row className="padding-box">
                    <Col span={24}>
                        {
                            currentUser.imgId ? (
                                <img src={'https://storage.kun.uz/source/thumbnails/_medium/6/rs2DS35O3xMe-uOJqMB6iy13o0w-Ql2A_medium.jpg'} alt="Img error" />
                                // <img src={host+':'+port+'/api/auth/file/'+currentUser.imgId} alt="Img error" />
                            ) : (
                                    <Row justify="center">
                                        <Col>
                                            <Skeleton.Image />
                                        </Col>
                                    </Row>
                                )
                        }
                    </Col>
                    <Col span={24} className="text-box">
                        <h3 className="username">
                            {currentUser.firstname} {currentUser.lastname}
                        </h3>
                    </Col>
                    <Divider className="m-0" />
                    <Col className="profile-menu padding-box">
                        <Menu
                            onClick={(e) => setMenu(e.key)}
                            selectedKeys={[currentMenu]}
                            defaultSelectedKeys={['1']}
                        >
                            {
                                menus.map((menu) => (
                                    <Menu.Item key={menu.path} onClick={() => history.push(menu.path)}>
                                        {menu.label}
                                    </Menu.Item>
                                ))
                            }
                        </Menu>
                    </Col>
                </Row>
            </Col>

            <Col xs={24} sm={24} md={16} lg={16}>
                <div className="user-info padding-box">
                    <h3>
                        {content.profile_header}
                    </h3>
                    <p>
                        {content.profile_subheader}
                    </p>
                    <Divider className="m-0" />
                </div>

                <div className="profile-route-box padding-box">
                    <Switch>
                        <Route path={`${match.path}/reset-password`} render={() => <ResetPassword />} />
                        <Route exact path={`${match.path}`} render={() => <Main />} />
                    </Switch>
                </div>
            </Col>
        </Row>
    );
}

const mapStateToProps = (state) => {
    return {
        lang: state.initial_data.lang,
        langs: state.initial_data.langs,
        currentUser: state.initial_data.currentUser,
    }
}

export default withRouter(connect(mapStateToProps)(Profile));