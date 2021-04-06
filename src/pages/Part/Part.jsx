import React from 'react';
import { Row, Col, Input, Table, Skeleton, Space} from "antd";
import { connect } from 'react-redux';

import ModalForm from "./components/ModalForm";
import DeleteConfirm from "../../commonComponents/DeleteConfirm";

import "../pages.scss";
import {paginationDefaultItemCount} from "../../constants";
import {deletePart, getParts} from "../../server/config/admin/Part";
import {Link} from "react-router-dom";
import BreadcrumbCourse from "../../commonComponents/BreadcrumbCourse";

const { Search } = Input;

class Part extends React.Component {
    constructor() {
        super();
        this.state = {
            list: [],
            selectedRowKeys: [],
            isFetching: true,
            totalElements: 0,
            currentPage: 1,
            moduleId: localStorage.getItem("moduleId")
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
                title: " Наименование (русский)",
                dataIndex: `nameRu`,
            },
            {
                title: "Наименование (узбек)",
                dataIndex: `nameUz`,
            },
            {
                title: " Уроки",
                dataIndex: 'id',
                render: id =>
                    <Link to={`/lessons/${id}`} onClick={()=>this.handleClickedId(id)}>Уроки</Link>
            },
        ];
    };
    handleClickedId=(id)=>{
        localStorage.setItem("partId", id);
    };
    breadCrumb = () => {
        return [
            {
                pathUrl: "/dashboard",
                pathName: `Главная`,
            },
            {
                pathUrl: "/course",
                pathName: `Курси`,
            },
            {
                pathUrl: "/module",
                pathName: `Модули`,
            },
            {
                pathUrl: "/part",
                pathName: `Часть`,
            }
        ];
    };

    getList = () => {
        const { currentPage, moduleId} = this.state;
        const current = currentPage - 1;
        getParts(current, paginationDefaultItemCount, moduleId).then((res) => {
            if (res&&Array.isArray(res.data.content)) {
                this.setState({
                    isFetching: false,
                    selectedRowKeys: [],
                    totalElements: res.data.totalElements,
                    list: res.data.content,
                })
            } else {
                this.setState({
                    selectedRowKeys: [],
                    isFetching: false,
                })
            }
        })
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
        const { list, isFetching, totalElements, currentPage, selectedRowKeys } = this.state;
        const columns = this.renderColumns();
        const itemList = this.breadCrumb();

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
                            Часть
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
                                    <DeleteConfirm selectedIds={selectedRowKeys} getList={this.getList} delete={deletePart} />
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

export default connect(mapStateToProps)(Part);