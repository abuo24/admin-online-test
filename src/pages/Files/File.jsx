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
            selectedRowKeysHashId: [],
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
        let list = [];
        const { selectedRowKeys,selectedRowKeysHashId } = this.state;
        const id = record['id'];
        const hashid = record['hashId'];

        if (this.state.selectedRowKeys.includes(id)) {
            newList = selectedRowKeys.filter((selectedId) => selectedId !== id);
        } else {
            newList = [...selectedRowKeys, id];
        }
        if (this.state.selectedRowKeysHashId.includes(hashid)) {
            list = selectedRowKeys.filter((selectedId) => selectedId !== id);
        } else {
            list = [...selectedRowKeys, id];
        }

        this.setState({
            selectedRowKeys: newList,
            selectedRowKeysHashId: list
        })
    };

    onSelectedRowKeysChange = (selectedRowKeys) => {
        this.setState({ selectedRowKeys });
    };

    renderColumns = () => {

        return [
            {
                title:" ??????-??????",
                dataIndex: 'hashCode',
            },
            {
                title:" ????????????????????????",
                dataIndex: 'name',
            },

            {
                title:" ????????????",
                dataIndex: 'size',
            },
            {
                title:" ?????? ??????????????????????",
                dataIndex: 'type',
            },
            {
                title:" ????????",
                dataIndex: 'createAt',
            },
            {
                title: "??????????????",
                dataIndex: 'hashCode',
                render:hashCode=>(
                    <a target='_blank' href={`${host}:${port}/api/client/file/preview/${hashCode}`}>??????????????</a>
                )
            }
        ];
    };

    getList = () => {
        const { currentPage } = this.state;
        const current = currentPage - 1;
        
        if (current >= 0) {{
                getFiles(current, paginationDefaultItemCount).then((res) => {
                    if (res&&res.data) {
                        let listData=res.data.data.files;
                        let rowListData=[];
                        listData.map(function (blog) {
                            let row = {
                                id: blog.hashId,
                                hashCode: blog.hashId,
                                authValue: blog.auth?"AUTH":"SECRET",
                                type: blog.type,
                                name: blog.name,
                                size: blog.size,
                                createAt: moment(blog.date).format("YYYY-MM-DD / HH:mm:ss"),
                                contentType: blog.contentType
                            };
                            rowListData.push(row);
                            // count++;
                        });
                        this.setState({
                            isFetching: false,
                            selectedRowKeys: [],
                            totalElements: res.data.data.totalItems,
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
            selectedRowKeysHashId
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
                                ??????????
                            </h3>

                        </Space>
                    </Col>
                    <Col>
                        <Space>
                            <ModalForm  getList={this.getList} />

                            {
                                isMultiple && (
                                    <DeleteConfirm selectedIds={selectedRowKeysHashId} getList={this.getList} delete={deleteFile} />
                                )
                            }
                            <Search
                                key={1}
                                placeholder="??????????"
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
                                    showTotal: (totalElements) => `??????: ${totalElements}`,
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