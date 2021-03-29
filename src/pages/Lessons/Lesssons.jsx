import React from 'react';
import { Row, Col, Input, Table, Skeleton, Space} from "antd";
import { connect } from 'react-redux';

import "../pages.scss";
import {paginationDefaultItemCount} from "../../constants";
import BreadcrumbCourse from "../../commonComponents/BreadcrumbCourse";
import {deleteLesson, getLesson} from "../../server/config/admin/Lessons";
import ModalForm from "../Lessons/components/ModalForm";
import DeleteConfirm from "../../commonComponents/DeleteConfirm";

const { Search } = Input;

class Lesssons extends React.Component {
    constructor() {
        super();
        this.state = {
            list: [],
            listDatas:[],
            selectedRowKeys: [],
            isFetching: true,
            totalElements: 0,
            currentPage: 1,
            partId: localStorage.getItem("partId")
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
                title: "Наименование (русский)",
                dataIndex: `titleRu`,
            },
            {
                title: "Наименование (узбек)",
                dataIndex: `titleUz`,
            },
            {
                title: "Наименование видео",
                dataIndex: `name`,
            },
            {
                title: "Хэш-код",
                dataIndex: `hashCode`,
            },
        ];
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
            },
            {
                pathUrl: "/lessons",
                pathName: `Уроки`,
            }
        ];
    };

    getList = () => {
        const { currentPage, partId} = this.state;
        const current = currentPage - 1;
        getLesson(current, paginationDefaultItemCount, partId).then((res) => {
            if (res&&Array.isArray(res.data.content)) {
                let listDatas = [];
                res.data.content.map(function (lesson) {
                    let hashCode = lesson.attachment ? lesson.attachment.hashCode : '';
                    let name = lesson.attachment ? lesson.attachment.name : '';
                    let obj = {
                        id: lesson.id,
                        titleRu: lesson.titleRu,
                        titleUz: lesson.titleUz,
                        name,
                        hashCode
                    };
                    listDatas.push(obj);
                });
                this.setState({
                    isFetching: false,
                    selectedRowKeys: [],
                    totalElements: res.data.totalElements,
                    list: res.data.content,
                    listDatas
                })
            } else {
                this.setState({
                    selectedRowKeys: [],
                    isFetching: false,
                })
            }
        })
    };

    componentDidMount() {
        this.getList();
    }

    render() {
        const { list, isFetching, totalElements, currentPage, selectedRowKeys, listDatas} = this.state;
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
                            Уроки
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
                                    <DeleteConfirm selectedIds={selectedRowKeys} getList={this.getList} delete={deleteLesson} />
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
                                dataSource={listDatas}
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

export default connect(mapStateToProps)(Lesssons);