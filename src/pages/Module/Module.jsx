import React from 'react';
import { Row, Col, Input, Table, Skeleton, Space } from "antd";
import ModalForm from "./components/ModalForm";
import DeleteConfirm from "../../commonComponents/DeleteConfirm";

import "../pages.scss";
import { getModule} from "../../server/config/admin/Module";
import BreadcrumbCourse from "../../commonComponents/BreadcrumbCourse";

import moment from "moment";
import {deleteUser} from "../../server/config/admin/Users";

const { Search } = Input;

class Module extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            list: [],
            selectedRowKeys: [],
            isFetching: true,
            totalElements: 0,
            currentPage: 1,
            courseId: localStorage.getItem("groupId"),
        }
    }
    getCheckedObj = () => {
        const { list, selectedRowKeys } = this.state;
        let newObj = {};

        list.forEach((obj) => {
            if (selectedRowKeys.length === 1 && obj['id'] === selectedRowKeys[0]) {
                newObj = obj;
            }
        });
        return newObj;
    };
    handleClickedRow = (record) => {
        let newList = [];
        const { selectedRowKeys } = this.state;
        const id = record['id'];

        if (this.state.selectedRowKeys.includes(id)) {
            newList = selectedRowKeys.filter((selectedId) => selectedId !== id);
        } else {
            newList = [...selectedRowKeys, id];
        }

        this.setState({
            selectedRowKeys: newList,
        })
    };
    onSelectedRowKeysChange = (selectedRowKeys) => {
        this.setState({ selectedRowKeys });
    };
    breadCrumb = () => {
        return [
            {
                pathUrl: "/dashboard",
                pathName: `Главная`,
            },
            {
                pathUrl: "/category",
                pathName: `Группы`,
            },
            {
                pathUrl: "/dashboard",
                pathName: `Студенты`,
            },
        ];
    };
    renderColumns = () => {
        return [
            {
                title: "Ф.И.О",
                dataIndex: `fullName`,
            },
            {
                title: "Тел Номер",
                dataIndex: `phoneNumber`,
            },
            {
                title: "Дата создания",
                dataIndex: `createAt`,
            }
        ];
    };
    handleClickedId=(id)=>{
        localStorage.setItem("moduleId", id);
    };
    getList = () => {
        const { currentPage, courseId} = this.state;
        const current = currentPage - 1;
        getModule(courseId).then((res) => {
            if (res&&Array.isArray(res.data.data.users)) {

                this.setState({
                    isFetching: false,
                    selectedRowKeys: [],
                    totalElements: res.data.data.totalItems,
                    list: res.data.data.users,
                })
                let list = res.data.data.users;
                let listColumns=[];
                list.map(function (u) {
                    let obj = {
                        id: u.id,
                        fullName: u.first_name+' '+u.last_name,
                        phoneNumber: u.phoneNumber,
                        createAt: moment(u.createAt).format("YYYY-MM-DD / HH:mm:ss"),
                    };
                    listColumns.push(obj);
                });
                this.setState({
                    listColumns
                })
            } else {
                this.setState({
                    selectedRowKeys: [],
                    isFetching: false
                })
            }
        })
    };

    handlePaginationChange = (page) => {
        this.setState({
            currentPage: page,
        }, () => this.getList());
    };

    componentDidMount=()=>{
        this.getList();
    };
    render() {
        const { listColumns, isFetching, totalElements, currentPage, selectedRowKeys } = this.state;
        const columns = this.renderColumns();
        const itemList = this.breadCrumb();

        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectedRowKeysChange,
        };

        const isMultiple = selectedRowKeys.length > 0;
        const isSingle = selectedRowKeys.length === 1;
        const {  edit } = this.props;
        return (
            <div className="bg-white site-border">
                <Row align="middle" justify="space-between" className="page-header site-border-bottom">
                    <Col>
                        <h3>
                            Студенты
                        </h3>
                    </Col>
                    <Col>
                        <Space>
                            <BreadcrumbCourse itemList={itemList}/>
                            <ModalForm getList={this.getList} />
                            {
                                isSingle && (
                                    <ModalForm edit getList={this.getList} getObj={this.getCheckedObj} />
                                )
                            }
                            {
                                isMultiple && (
                                    <DeleteConfirm selectedIds={selectedRowKeys} getList={this.getList} delete={deleteUser} />
                                )
                            }
                            <Search
                                key={1}
                                placeholder="Поиск"
                                onSearch={value => console.log(value)}
                                style={{ width: 200 }}
                            />
                        </Space>
                    </Col>
                </Row>

                {
                    isFetching ? (
                        <Skeleton active />
                    ) : (
                            <Table
                                pagination={{
                                    current: currentPage,
                                    total: totalElements,
                                    pageSize:10,
                                    onChange: this.handlePaginationChange,
                                    showTotal: (totalElements) => `ВСЕ: ${totalElements}`,
                                }}
                                tableLayout="fixed"
                                bordered
                                size="small"
                                rowSelection={rowSelection}
                                columns={columns}
                                dataSource={listColumns}
                                rowKey="id"
                                scroll={{ x: 700 }}
                                onRow={(record) => {
                                    return {
                                        onClick: () => {
                                            this.handleClickedRow(record);
                                        },
                                    };
                                }}
                            />
                        )
                }
            </div>
        );
    }
}
export default Module;
//
// const mapStateToProps = (state) => {
//     return {
//
//     }
// };
//
// export default connect(mapStateToProps)(Answer);