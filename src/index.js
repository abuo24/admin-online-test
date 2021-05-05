import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { Provider } from "react-redux";
import { message } from "antd";
import store from "./redux/store";

import "antd/dist/antd.css";
import axios from "axios";
message.config({
    duration: 2,
    maxCount: 3,
});
ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById("root")
);
serviceWorker.unregister();