/* LIBRARIES */
import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";

/* FUNCTIONS */
import { checkCookie } from "./utils/useCookies";

/* CONSTANTS */
import { userAccessTokenName } from "./constants";

/* COMPONENTS */
import LazyLoadErrorBoundary from "./commonComponents/LazyLoadErrorBoundary";

const Dashboard = lazy(() => import("./rootDirectories/Dashboard/Dashboard"));
const Login = lazy(() => import("./rootDirectories/Login/Login"));

class App extends React.Component {
    render() {
        return (
            <Router>
                <LazyLoadErrorBoundary>
                    <Switch>
                        <Route path="/login" render={() => (
                            <Suspense fallback={""}>
                                <Login />
                            </Suspense>
                        )} />
                        {
                            !checkCookie(userAccessTokenName) && (
                                <Route>
                                    <Redirect to="/login" />
                                </Route>
                            )
                        }
                        <Redirect exact from="/" to="/dashboard" />

                        <Route exact path="/dashboard" render={() => (
                            <Suspense fallback={"Loading..."}>
                                <Dashboard />
                            </Suspense>
                        )} />
                        <Route render={() => <Redirect to="/dashboard" />} />
                    </Switch>
                </LazyLoadErrorBoundary>
            </Router>
        )
    }
}

export default App;