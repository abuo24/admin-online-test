import React from 'react';
import { Row, Col, Input, Table, Skeleton, Space} from "antd";
import { connect } from 'react-redux';

import "../pages.scss";
import BreadcrumbCourse from "../../commonComponents/BreadcrumbCourse";
import {getPart} from "../../server/config/admin/Part";

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
            partId: localStorage.getItem("partId"),
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
                title: "Наименование (русский)",
                dataIndex: `nameRu`,
            },
            {
                title: "Наименование (узбек)",
                dataIndex: `nameUz`,
            }
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
                pathUrl: "/part",
                pathName: `Второй набор предметов`,
            },
            {
                pathUrl: "/lessons",
                pathName: `Набор третьих предметов`,
            }
        ];
    };

    getList = () => {
        const { currentPage,moduleId, partId} = this.state;
        const current = currentPage - 1;
        getPart(moduleId,partId).then((res) => {
            if (res&&Array.isArray(res.data.data)) {
                let listDatas = [];
                res.data.data.map(function (lesson) {
                    let obj = {
                        id: lesson.id,
                        nameRu: lesson.nameRu,
                        nameUz: lesson.nameUz,
                    };
                    listDatas.push(obj);
                });
                this.setState({
                    isFetching: false,
                    selectedRowKeys: [],
                    totalElements: res.data.data.length,
                    list: res.data.data,
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
    handlePaginationChange = (page) => {
        this.setState({
            currentPage: page,
        }, () => this.getList());
    };


    render() {
        const { list, isFetching, totalElements, currentPage, selectedRowKeys, listDatas} = this.state;
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
                            Уроки
                        </h3>
                    </Col>
                    <Col>
                        <Space>
                            <BreadcrumbCourse itemList={itemList}/>

                            <Search
                                key={1}
                                placeholder="Поиск"
                                onSearch={value => console.log(value)}
                                style={{ width: 200 }}/>
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