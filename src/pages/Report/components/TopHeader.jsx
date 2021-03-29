import React from 'react';
import {  Typography, Row, Col } from "antd";
import { Link, withRouter } from "react-router-dom";
const { Title } = Typography;

function TopNavbar() {

    return (
        <React.Fragment>
            <Row align="middle" justify="space-between" className="top-navbar">
                <Col flex="100px">
                    <Title level={4}>
                        <Link to='/'>
                       Online Zako Admin
                        </Link>
                    </Title>
                </Col>
            </Row>

        </React.Fragment>
    );
}

export default TopNavbar;