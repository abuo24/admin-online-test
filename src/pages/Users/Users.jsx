import React from 'react';
import {Row, Col, Input, Table, Skeleton, Space, Radio, Button} from "antd";
import {connect} from 'react-redux';

import ModalForm from "./components/ModalForm";
import DeleteConfirm from "../../commonComponents/DeleteConfirm";
import {paginationDefaultItemCount} from "../../constants";

import "../pages.scss";
import {deleteUser, getUsers} from "../../server/config/admin/Users";
import {Link} from "react-router-dom";
import moment from "moment";

const {Search} = Input;

class Users extends React.Component {
    constructor() {
        super();
        this.state = {
            list: [],
            selectedRowKeys: [],
            isFetching: true,
            totalElements: 0,
            currentPage: 1,
            userType: 'student',
            listColumns: [],
            courses: []
        }
    }

    getCheckedObj = () => {
        const {list, selectedRowKeys} = this.state;
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
        const {selectedRowKeys} = this.state;
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
        this.setState({selectedRowKeys});
    };

    renderStudentColumns = () => {
        return [
            {
                title: "Ф.И.О",
                dataIndex: 'fullName',
            },
            {
                title: "Тел Номер",
                dataIndex: 'phoneNumber',
            },
            {
                title: "Дата создания",
                dataIndex: 'createAt',
            }
        ];
    };
    handleClickedId = (id) => {
        localStorage.setItem("userId", id);
    };

    getStudentList = () => {
        const {currentPage} = this.state;
        const current = currentPage - 1;
        if (current >= 0) {
            {
                getUsers(current, paginationDefaultItemCount).then((res) => {
                    if (res && res.data) {
                        let list = res.data.data.users;
                        let listColumns = [];
                        list.map(function (u) {
                            let obj = {
                                id: u.id,
                                fullName: u.first_name + ' ' + u.last_name,
                                active: u.accountNonLocked,
                                phoneNumber: u.phoneNumber,
                                createAt: moment(u.createAt).format("YYYY-MM-DD / HH:mm:ss"),
                            };
                            listColumns.push(obj);
                        });
                        this.setState({
                            isFetching: false,
                            selectedRowKeys: [],
                            totalElements: res.data.data.totalItems,
                            listColumns,
                            list,
                        })
                    } else {
                        this.setState({
                            selectedRowKeys: [],
                            isFetching: false,
                        })
                    }
                });
                this.setState({
                    isFetching: false,
                    selectedRowKeys: [],
                    totalElements: 0,
                    list: [],
                    listColumns: []
                })
            }
        }
    };

    getCollections = () => {
        this.getStudentList();
    };

    handlePaginationChange = (page) => {
        this.setState({
            currentPage: page,
        }, () => this.getStudentList())
    };

    componentDidMount() {
        this.getCollections();
    }

    handleSizeChange = e => {
        this.setState({
            userType: e.target.value,
        });
    };

    render() {
        const {
            list,
            isFetching,
            totalElements,
            currentPage,
            selectedRowKeys,
            courses,
            listColumns,
            userType
        } = this.state;
        const studentColumns = this.renderStudentColumns();

        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectedRowKeysChange,
        };


        const isMultiple = selectedRowKeys.length > 0 ? true : false;
        const isSingle = selectedRowKeys.length === 1 ? true : false;
        const {edit} = this.props;
        return (
            <div className="bg-white site-border">
                <Row justify="space-between" className="page-header site-border-bottom">
                    <Col>
                        <Space>
                            <h3>
                                {userType === 'student' ? 'Студенты' : 'Учителя'}
                            </h3>
                        </Space>
                    </Col>
                    <Col>
                        <Space style={{marginRight: '1vh'}}>
                            <Radio.Group value={userType} onChange={this.handleSizeChange}>
                                <Radio.Button value="student">Студенты</Radio.Button>
                            </Radio.Group>
                        </Space>
                        <Space>
                            <ModalForm courses={courses}
                                       getList={this.getStudentList}
                                       userType={userType}
                            />

                            {
                                isSingle && (
                                    <ModalForm edit courses={courses}
                                               getList={this.getStudentList}
                                               getObj={this.getCheckedObj}
                                               userType={userType}
                                    />

                                )
                            }
                            {
                                isMultiple && (
                                    <DeleteConfirm selectedIds={selectedRowKeys}
                                                   getList={this.getStudentList}
                                                   delete={deleteUser}/>
                                )
                            }
                            <Search
                                key={1}
                                placeholder="Поиск"
                                onSearch={value => console.log(value)}
                                style={{width: 200}}
                            />
                        </Space>
                    </Col>
                </Row>
                {
                    isFetching ? (
                        <Skeleton active/>
                    ) : (
                        <Table
                            pagination={{
                                current: currentPage,
                                total: totalElements,
                                pageSize: 10,
                                onChange: this.handlePaginationChange,
                                showTotal: (totalElements) => `ВСЕ: ${totalElements}`,
                            }}
                            tableLayout="fixed"
                            bordered
                            size="small"
                            rowSelection={rowSelection}
                            columns={studentColumns}
                            dataSource={listColumns}
                            rowKey="id"
                            scroll={{x: 1000}}
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

const mapStateToProps = (state) => {
    return {
        lang: state.initial_data.lang,
        langs: state.initial_data.langs,
    }
}

export default connect(mapStateToProps)(Users);