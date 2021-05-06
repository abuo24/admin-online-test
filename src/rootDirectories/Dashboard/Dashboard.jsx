/* LIBRARIES */
import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Row, Col, Layout, Spin } from 'antd';
import { connect } from 'react-redux';
// import { Base64 } from 'js-base64';

/* FUNCTIONS */
import { deleteCookie } from "../../utils/useCookies";

/* HOST */
import { getUserInfo, getFile } from "../../server/config";

/* CONSTANTS */
import { userAccessTokenName } from "../../constants";
import { permissions } from "../../permissions";

/* STATE MANAGEMENT */
import { setPermissions, setCurrentUser } from "../../redux/actions";

/* STYLES */
import "./dashboard.scss";
import "../../index.css";

/* COMPONENTS */
import LazyLoadErrorBoundary from "../../commonComponents/LazyLoadErrorBoundary";
import TopHeader from "./components/TopHeader";
import HorizontalMenus from "./components/HorizontalMenus";
import Users from "../../pages/Users/Users";
import Category from "../../pages/Category/Category";
import File from "../../pages/Files/File";
import Course from "../../pages/Course/Course";
import Messages from "../../pages/Messages/Messages";
import Module from "../../pages/Module/Module";
import Part from "../../pages/Part/Part";
import Lesssons from "../../pages/Lessons/Lesssons";
import Followers from "../../pages/Followers/Followers";
import Question from "../../pages/Question/Question";

const Base64 = import('js-base64').then((module) => module);

const NotFound = lazy(() => import('../../pages/NotFound/NotFound'));

const { Header, Content } = Layout;
const routes = [
    {
        path: "/dashboard",
        component: <Users/>,
    },
    {
        path: "/followers",
        component: <Followers/>,
    }
    ,
    {
        path: "/module",
        component: <Module/>,
    },
    {
        path: "/part",
        component: <Part/>,
    },
    {
        path: "/lessons",
        component: <Lesssons/>,
    },
    {
        path: "/category",
        component: <Category/>,
    },
    {
        path: "/file",
        component: <File/>,
    },
    {
        path: "/course",
        component: <Course/>,
    },
    {
        path: "/messages",
        component: <Messages/>,
    },
    {
        path: "/question",
        component: <Question/>,
    }
];

class Dashboard extends React.Component {
    state = {
        collapsed: false,
    };

    toggle = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    };



    getUserPhoto = (id, params) => {
        // if (id) {
        //     getFile(id).then((res) => {
        //         if (res && res.data) {
        //             console.log(res.data);
        //
        //             // Base64.then(all => {
        //             //     this.props.setCurrentUser({
        //             //         ...params,
        //             //         img: `data:image/png;base64`,
        //             //     });
        //             // })
        //
        //         }
        //     })
        // }
    };

    componentDidMount() {
        getUserInfo().then((res) => {
            if (res && res.data) {
                this.props.setCurrentUser(res.data);
            }
        })
    }

    render() {

        return (
            <React.Fragment>
                <Router>
                    <Layout className="layout">
                        <Header className="site-header">
                            <TopHeader />
                            <div className="container">
                                <HorizontalMenus />
                            </div>
                        </Header>
                        <Content className="container" style={{ padding: '20px 0' }}>
                            <LazyLoadErrorBoundary>
                                <Switch>
                                    {
                                        routes.map((route) => (
                                            <Route key={route.path} path={route.path}
                                                   render={() => renderComponentWithSuspense(route.component)} />

                                        ))
                                    }
                                    <Route exact path='/dashboard' render={() => renderComponentWithSuspense(<Dashboard />)} />
                                    <Route render={() => renderComponentWithSuspense(<NotFound />)} />
                                </Switch>
                            </LazyLoadErrorBoundary>
                        </Content>
                    </Layout>
                </Router>
            </React.Fragment>
        )
    }
}
function renderComponentWithSuspense(component) {
    return (
        <Suspense fallback={
            <Row className="container" justify="center">
                <Col>
                    <Spin />
                </Col>
            </Row>
        }>
            {component}
        </Suspense>
    )
}

const mapStateToProps = (state) => {
    return {
        currentUser: state.initial_data.current_user,
    }
};

export default connect(mapStateToProps, { setPermissions, setCurrentUser })(Dashboard);