import React,{Component} from "react";
import { Breadcrumb } from 'antd';
import {Link} from "react-router-dom";
import Course from "../pages/Course/Course";

class BreadcrumbCourse extends Component{
    constructor(props) {
        super(props);
        this.state={
            itemList:this.props.itemList
        }

    }
    render() {
        const {itemList}=this.state;
        return(
            <Breadcrumb>
                {Array.isArray(itemList)?itemList.map((item, index, array)=>(
                    <Breadcrumb.Item key={item.pathUrl}>
                        {array[index+1]?<Link to={item.pathUrl}>{item.pathName}</Link>:item.pathName}
                    </Breadcrumb.Item>
                )):''}
            </Breadcrumb>
        )
    }

}
export default BreadcrumbCourse;