import React from 'react';
import { Row, Col, Input, Table, Skeleton, Space } from "antd";
import { connect } from 'react-redux';

import ModalForm from "./components/ModalForm";
import DeleteConfirm from "../../commonComponents/DeleteConfirm";

import "../pages.scss";
import {deleteCategory, getCategories} from "../../server/config/admin/Category";
import {paginationDefaultItemCount} from "../../constants";
import {Link} from "react-router-dom";

const { Search } = Input;

class Category extends React.Component {
    constructor() {
        super();
        this.state = {
            list: [],
            selectedRowKeys: [],
            isFetching: true,
            totalElements: 0,
            currentPage: 1,
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
    handleClickedId(id){
        console.log(id);
        localStorage.setItem("groupId",id);
    };
    renderColumns = () => {

        return [
            {
                title: " Наименование (русский)",
                dataIndex: `name`,
            },
            {
                title: "Наименование (узбек)",
                dataIndex: `createAt`,
            },{
                title: " Модул",
                dataIndex: 'id',
                render: id =>
                    <Link to={`/module/${id}`} onClick={()=>this.handleClickedId(id)}>Users</Link>
            }
        ];
    };

    getList = () => {
        const { currentPage } = this.state;
        const current = currentPage - 1;
        getCategories(current, paginationDefaultItemCount).then((res) => {
            if (res&&Array.isArray(res.data.data.groups)) {
                this.setState({
                    isFetching: false,
                    selectedRowKeys: [],
                    totalElements: res.data.totalElements,
                    list: res.data.data.groups,
                })
            } else {
                this.setState({
                    selectedRowKeys: [],
                    isFetching: false,
                })
            }
        })
    };

    // setPagenination = (e) => {
    //     this.setState({
    //         currentPage: page,
    //     }, () => this.getList());
    // };

    componentDidMount() {
        this.getList();
    }
    handlePaginationChange = (page) => {
        this.setState({
            currentPage: page,
        }, () => this.getList());
    };
    render() {
        const { list, isFetching, totalElements, currentPage, selectedRowKeys } = this.state;
        const columns = this.renderColumns();


        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectedRowKeysChange,
        };

        const isMultiple = selectedRowKeys.length > 0 ? true : false;
        const isSingle = selectedRowKeys.length === 1 ? true : false;
        const {  edit } = this.props;
        return (
            <div className="bg-white site-border">
                <Row align="middle" justify="space-between" className="page-header site-border-bottom">
                    <Col>
                        <h3>
                            Категории
                        </h3>
                    </Col>
                    <Col>
                        <Space>
                            <ModalForm getList={this.getList} />

                            {
                                isSingle && (
                                    <ModalForm edit getList={this.getList} getObj={this.getCheckedObj} />
                                )
                            }
                            {
                                isMultiple && (
                                    <DeleteConfirm selectedIds={selectedRowKeys} getList={this.getList} delete={deleteCategory} />
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

const mapStateToProps = (state) => {
    return {

    }
};

export default connect(mapStateToProps)(Category);