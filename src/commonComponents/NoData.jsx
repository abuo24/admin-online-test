import React from 'react';
import { Empty, Row, Col } from "antd";

const NoData = (props) => {
    const height = props.height ? props.height : 'initial';
    return (
        <Row className="site-border bg-white" style={{ height }} align="middle" justify="center">
            <Col>
                <Empty description="Ma'lumot yo'q" />
            </Col>
        </Row>
    );
}

export default NoData;