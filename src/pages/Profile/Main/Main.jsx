import React from 'react';
import { connect } from "react-redux";
import { Row, Col } from 'antd';

const backKeys = ["id", "roles", "active", "imgId"]

const Main = ({ langs, lang, currentUser }) => {
    const objAsArray = Object.entries(currentUser);
    const content = langs[lang];
    
    return (
        <Row gutter={[16]}>

            {
                objAsArray.map((item) => {
                    if (!backKeys.includes(item[0]) && item[1]) {
                        return (
                            <Col xs={24} sm={24} md={12} lg={12} key={item[0]}>
                                <b>{content[item[0]]}</b>: {item[1]}
                            </Col>
                        )
                    }
                })
            }
        </Row>
    );
}

const mapStateToProps = (state) => {
    const initial_data = state.initial_data;
    return {
        lang: initial_data.lang,
        langs: initial_data.langs,
        currentUser: initial_data.currentUser,
    }
}

export default connect(mapStateToProps)(Main);