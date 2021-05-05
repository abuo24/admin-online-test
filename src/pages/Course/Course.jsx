import React from 'react';
import {Row, Col, Input, Table, Skeleton, Space} from "antd";
import {connect} from 'react-redux';

import ModalForm from "./components/ModalForm";
import DeleteConfirm from "../../commonComponents/DeleteConfirm";
import {paginationDefaultItemCount} from "../../constants";

import "../pages.scss";
import {Link} from "react-router-dom";
import {deleteCourse, getCourse} from "../../server/config/admin/Course";
import {getTeachers} from "../../server/config/admin/Teacher";
import {getCategories} from "../../server/config/admin/Category";

const {Search} = Input;

class Course extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // courseId: null,
            // module: false,
            list: [],
            selectedRowKeys: [],
            isFetching: true,
            totalElements: 0,
            currentPage: 1,

            listDatas: [],
            teachers: [],
            categories: []
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
        });
    };
    handleClickedId(id){
        console.log(id);
        localStorage.setItem("subjectId",id);
    };
    onSelectedRowKeysChange = (selectedRowKeys) => {
        this.setState({selectedRowKeys});
    };

    renderColumns = () => {
        return [
            {
                title: " Название курса (Русский)",
                dataIndex: 'nameRu',
            },
            {
                title: " Название курса (Русский)",
                dataIndex: 'nameUz',
            }, {
                title: " Название курса (Русский)",
                dataIndex: 'parentsFirst',
            },
            {
                title: "3 blok",
                dataIndex: 'id',
                render: id =>
                    <Link to={`/part/${id}`} onClick={()=>this.handleClickedId(id)}>3 Blok</Link>
            },
        ];
    };
    getList = () => {
        const {currentPage} = this.state;
        const current = currentPage - 1;
        if (current >= 0) {
            {
                getCourse(current, paginationDefaultItemCount).then((res) => {
                    if (res &&res.data&&res.data.data&&res.data.data.subjects&& Array.isArray(res.data.data.subjects)) {
                        let listDatas = [];

                        res.data.data.subjects.map(function (course) {
                            let mas = []
                            course.parentsFirst.map(i=>{
                                mas.push(i.nameRu)
                            })
                            let obj = {
                                id: course.id,
                                nameRu: course.nameRu,
                                nameUz: course.nameUz,
                                parentsFirst: mas.toString()
                            };

                            listDatas.push(obj);
                        });
                        this.setState({
                            isFetching: false,
                            selectedRowKeys: [],
                            totalElements: res.data.data.totalItems,
                            list: res.data.data.subjects,
                            listDatas: listDatas
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
    getCollections = () => {

        this.getList();
    };

    handlePaginationChange = (page) => {
        this.setState({
            currentPage: page,
        }, () => this.getList());
    };

    componentDidMount() {
        this.getCollections();
    }

    render() {
        const {
            list,
            isFetching,
            totalElements,
            currentPage,
            selectedRowKeys,
            module,
            courseId,
            teachers,
            listDatas,
            categories,
        } = this.state;
        const columns = this.renderColumns();

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
                                Список курсов
                            </h3>

                        </Space>
                    </Col>
                    <Col>
                        <Space>
                            <ModalForm list={list} categories={categories} getList={this.getList}/>

                            {
                                isSingle && (
                                    <ModalForm list={list}  edit categories={categories} teachers={teachers} getList={this.getList}
                                               getObj={this.getCheckedObj}/>
                                )
                            }
                            {
                                isMultiple && (
                                    <DeleteConfirm list={list}  selectedIds={selectedRowKeys} getList={this.getList}
                                                   delete={deleteCourse}/>
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
                            columns={columns}
                            dataSource={listDatas}
                            rowKey="id"
                            scroll={{x: 1000}}
                            onRow={(record) => {
                                return {
                                    onClick: () => {
                                        this.handleClickedRow(record);
                                    },
                                    // onDoubleClick: () => {
                                    //     this.handleClickedDouble(record);
                                    // }
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
};

export default connect(mapStateToProps)(Course);