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
        localStorage.setItem("courseId",id);
    };
    onSelectedRowKeysChange = (selectedRowKeys) => {
        this.setState({selectedRowKeys});
    };

    renderColumns = () => {
        return [
            {
                title: " Название курса (Русский)",
                dataIndex: 'titleRu',
            },
            {
                title: " Статус",
                dataIndex: 'status',
            },
            {
                title: " Категория",
                dataIndex: 'category',
            },
            {
                title: " Учитель",
                dataIndex: 'teacher',
            },
            {
                title: " Продолжительность",
                dataIndex: 'duration',
            },
            {
                title: " Модул",
                dataIndex: 'id',
                render: id =>
                    <Link to={`/module/${id}`} onClick={()=>this.handleClickedId(id)}>Module</Link>
            },
        ];
    };
    getList = () => {
        const {currentPage} = this.state;
        const current = currentPage - 1;
        if (current >= 0) {
            {
                getCourse(current, paginationDefaultItemCount).then((res) => {
                    if (res && Array.isArray(res.data.content)) {
                        let listDatas = [];
                        res.data.content.map(function (course) {
                            let teacher = course.teacher ? course.teacher.firstName : '';
                            let category = course.category ? course.category.nameRu : '';
                            let obj = {
                                id: course.id,
                                titleRu: course.titleRu,
                                status: course.status,
                                category,
                                teacher,
                                duration: course.duration
                            };
                            listDatas.push(obj);
                        });
                        this.setState({
                            isFetching: false,
                            selectedRowKeys: [],
                            totalElements: res.data.totalElements,
                            list: res.data.content,
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
        getTeachers().then(res => {
            this.setState({
                teachers: res.data.content
            })
        });
        getCategories().then(res => {

            this.setState({
                categories: res.data.content
            })
        });
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
                            <ModalForm teachers={teachers} categories={categories} getList={this.getList}/>

                            {
                                isSingle && (
                                    <ModalForm edit categories={categories} teachers={teachers} getList={this.getList}
                                               getObj={this.getCheckedObj}/>
                                )
                            }
                            {
                                isMultiple && (
                                    <DeleteConfirm selectedIds={selectedRowKeys} getList={this.getList}
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