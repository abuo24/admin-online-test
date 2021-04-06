import React from 'react';
import { Row, Col, Input, Table, Skeleton, Space, Select } from "antd";
import { connect } from 'react-redux';

import ModalForm from "./components/ModalForm";
import DeleteConfirm from "../../commonComponents/DeleteConfirm";
import { paginationDefaultItemCount } from "../../constants";

import "../pages.scss";
import {deleteFile, getFiles} from "../../server/config/admin/File";
import {host, port} from "../../server/host";
import moment from "moment";

const { Search } = Input;
const { Option } = Select;

class File extends React.Component {
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

    renderColumns = () => {

        return [
            {
                title:" Хэш-код",
                dataIndex: 'hashCode',
            },
            {
                title:" Наименование",
                dataIndex: 'name',
            },
            {
                title:" AUTH?",
                dataIndex: 'authValue',
            },
            {
                title:" Размер",
                dataIndex: 'size',
            },
            {
                title:" Тип содержимого",
                dataIndex: 'contentType',
            },
            {
                title:" Дата",
                dataIndex: 'createAt',
            },
            {
                title: "увидеть",
                dataIndex: 'hashCode',
                render:hashCode=>(
                    <a target='_blank' href={`${host}:${port}/api/client/file/preview/${hashCode}`}>увидеть</a>
                )
            }
        ];
    };

    getList = () => {
        const { currentPage } = this.state;
        const current = currentPage - 1;
        
        if (current >= 0) {{
                getFiles(current, paginationDefaultItemCount).then((res) => {
                    if (res&&Array.isArray(res.data.content)) {
                        let listData=res.data.content;
                        let rowListData=[];
                        // let count = 1;
                        listData.map(function (blog) {
                            let row = {
                                id: blog.hashCode,
                                hashCode: blog.hashCode,
                                authValue: blog.auth?"AUTH":"SECRET",
                                auth: blog.auth,
                                name: blog.name,
                                size: blog.size,
                                createAt: moment(blog.createAt).format("YYYY-MM-DD / HH:mm:ss"),
                                contentType: blog.contentType
                            };
                            rowListData.push(row);
                            // count++;
                        });
                        this.setState({
                            isFetching: false,
                            selectedRowKeys: [],
                            totalElements: res.data.totalElements,
                            list:rowListData,
                            // list:res.data.content
                        })
                    } else {
                        this.setState({
                            selectedRowKeys: [],
                            isFetching: false,
                        })
                    }
                });
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

        } = this.state;
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
                <Row justify="space-between" className="page-header site-border-bottom">
                    <Col>
                        <Space>
                            <h3>
                                Файлы
                            </h3>

                        </Space>
                    </Col>
                    <Col>
                        <Space>
                            <ModalForm  getList={this.getList} />

                            {
                                isSingle && (
                                    <ModalForm edit getList={this.getList} getObj={this.getCheckedObj} />
                                )
                            }
                            {
                                isMultiple && (
                                    <DeleteConfirm selectedIds={selectedRowKeys} getList={this.getList} delete={deleteFile} />
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

export default connect(mapStateToProps)(File);