/* LIBRARIES */
import React, { Suspense, lazy } from 'react';

import {  Layout } from 'antd';

import "../../rootDirectories/Dashboard/dashboard.scss";
import "../../index.css";

/* COMPONENTS */
import LazyLoadErrorBoundary from "../../commonComponents/LazyLoadErrorBoundary";
import Report from "./Report";
import TopHeader from "./components/TopHeader";
const { Header, Content } = Layout;
class Index extends React.Component {
    render() {

        return (
            <React.Fragment>

                    <Layout className="layout">
                        <Header className="site-header">
                            <TopHeader />
                        </Header>
                        <Content className="container" style={{ padding: '20px 0' }}>
                            <LazyLoadErrorBoundary>
                        <Report/>
                            </LazyLoadErrorBoundary>
                        </Content>
                    </Layout>

            </React.Fragment>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        currentUser: state.initial_data.current_user,
    }
}

export default Index;