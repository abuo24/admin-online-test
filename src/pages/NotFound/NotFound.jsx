import React from "react";
import { Button, Result } from "antd";
import { Link } from "react-router-dom";

const NotFound = () => {
    return (
        <Result
            status="404"
            title="404"
            className="bg-white site-border"
            subTitle="Sorry, the page you visited does not exist."
            extra={
                <Link to="/dashboard">
                    <Button type="primary">Back Home</Button>
                </Link>
            }
        />
    )
}

export default NotFound;