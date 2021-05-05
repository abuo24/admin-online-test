import React from 'react';
import { Row, Col, Input, Table, Skeleton, Space, Select } from "antd";
import { connect } from 'react-redux';

import ModalForm from "./components/ModalForm";
import DeleteConfirm from "../../commonComponents/DeleteConfirm";
import { paginationDefaultItemCount } from "../../constants";

import "../pages.scss";
import moment from "moment";
import {deleteFollower, getFollowers} from "../../server/config/admin/Followers";
const { Search } = Input;
const { Option } = Select;

class Followers extends React.Component {
    constructor() {
        super();
        this.state = {
            list: [],
            selectedRowKeys: [],
            isFetching: true,
            totalElements: 0,
            currentPage: 1,

            courses:[],
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

    renderColumns = () => {

        return [
            {
                title:"Полное имя",
                dataIndex: 'name',
            },

            {
                title:" Эл. почта",
                dataIndex: 'code',
            },
            {
                title:"Телефонный номер",
                dataIndex: 'subjectFirst',
            },
            {
                title:"Телефонный номер",
                dataIndex: 'subjectSecond',
            },
            {
                title:"Телефонный номер",
                dataIndex: 'subjectThird',
            },

            {
                title:"Дата",
                dataIndex: 'createAt',
            },
        ];
    };

    getList = () => {
        const { currentPage } = this.state;
        const current = currentPage - 1;
        
        if (current >= 0) {{
                getFollowers(current, paginationDefaultItemCount).then((res) => {
                    if (res) {
                        let users = res.data&&res.data.data&&res.data.data.routes;
                        let listRows=[];
                        users.map(function (u) {
                            let obj = {
                                id: u.id,
                                name: u.name,
                                code: u.code,
                                subjectFirst: u.subjectFirst.nameRu,
                                subjectSecond: u.subjectSecond.nameRu,
                                subjectThird: u.subjectThird.nameRu,
                                interest:u.interest,
                                createAt: moment(u.createAt).format("YYYY-MM-DD / HH:mm:ss"),
                            };
                            listRows.push(obj);
                        });
                        this.setState({
                            isFetching: false,
                            selectedRowKeys: [],
                            totalElements: res.data.totalElements,
                            list:listRows,
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
                list:[]
            })
            }
        }
    };

    handlePaginationChange = (page) => {
        this.setState({
            currentPage: page,
        }, () => this.getList());
    };

    componentDidMount() {
        this.getList();
    }

    render() {
        const {
            list,
            isFetching,
            totalElements,
            currentPage,
            selectedRowKeys,
            courses

        } = this.state;
        const columns = this.renderColumns();

        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectedRowKeysChange,
        }


        const isMultiple = selectedRowKeys.length > 0 ? true : false;
        const isSingle = selectedRowKeys.length === 1 ? true : false;
        const {  edit } = this.props;
        return (
            <div className="bg-white site-border">
                <Row justify="space-between" className="page-header site-border-bottom">
                    <Col>
                        <Space>
                            <h3>
                                Подписчики
                            </h3>

                        </Space>
                    </Col>
                    <Col>
                        <Space>
                            <ModalForm list={list} getList={this.getList} />

                            {
                                isSingle && (
                                    <ModalForm edit getList={this.getList} getObj={this.getCheckedObj} />
                                )
                            }
                            {
                                isMultiple && (
                                    <DeleteConfirm selectedIds={selectedRowKeys} getList={this.getList} delete={deleteFollower} />
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
                                dataSource={list}
                                rowKey="id"
                                scroll={{ x: 1000 }}
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

export default connect(mapStateToProps)(Followers);