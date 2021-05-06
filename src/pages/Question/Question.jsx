import React from 'react';
import {Row, Col, Input, Table, Skeleton, Space} from "antd";
import {connect} from 'react-redux';

import ModalForm from "./components/ModalForm";
import DeleteConfirm from "../../commonComponents/DeleteConfirm";
import {paginationDefaultItemCount} from "../../constants";

import "../pages.scss";
import {Link} from "react-router-dom";
import { getCourses} from "../../server/config/admin/Course";
import {deleteQuestion, getQuestion} from "../../server/config/admin/Question";

const {Search} = Input;

class Question extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            list: [],
            selectedRowKeys: [],
            isFetching: true,
            totalElements: 0,
            currentPage: 1,
            courses: [],
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
        localStorage.setItem("questionId",id);
    };
    onSelectedRowKeysChange = (selectedRowKeys) => {
        this.setState({selectedRowKeys});
    };

    renderColumns = () => {
        return [
            {
                title: " Название Вопрос (Русский)",
                dataIndex: 'nameRu',
            },
            {
                title: " Название Вопрос (Узбекский)",
                dataIndex: 'nameUz',
            }, {
                title: "Правильный ответ",
                dataIndex: 'correctAnswer',
            },{
                title: " Название предмет",
                dataIndex: 'subject',
            }
        ];
    };
    getList = () => {
        const {currentPage} = this.state;
        const current = currentPage - 1;
        if (current >= 0) {
            {
                getQuestion(current, paginationDefaultItemCount).then((res) => {
                    if (res &&res.data&&res.data.data&&res.data.data.questions&& Array.isArray(res.data.data.questions)) {
                        let listDatas = [];

                        res.data.data.questions.map(function (course) {
                            let obj = {
                                id: course.id,
                                nameRu: course.questionRu,
                                nameUz: course.questionUz,
                                correctAnswer: course.questionUz,
                                subject: course.subjects.nameRu,
                            };

                            listDatas.push(obj);
                        });
                        this.setState({
                            isFetching: false,
                            selectedRowKeys: [],
                            totalElements: res.data.data.totalItems,
                            list: res.data.data.questions,
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
        getCourses().then(res=>this.setState({
            ...this.state,
            courses: res.data&&res.data.data
        })).catch(err=>console.log(err));
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
            courses
        } = this.state;
        const columns = this.renderColumns();

        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectedRowKeysChange,
        };


        const isMultiple = selectedRowKeys.length > 0;
        const isSingle = selectedRowKeys.length === 1;
        const {edit} = this.props;
        return (
            <div className="bg-white site-border">
                <Row justify="space-between" className="page-header site-border-bottom">
                    <Col>
                        <Space>
                            <h3>
                                Список Вопросов
                            </h3>

                        </Space>
                    </Col>
                    <Col>
                        <Space>
                            <ModalForm courses={courses} list={list} categories={categories} getList={this.getList}/>

                            {
                                isSingle && (
                                    <ModalForm courses={courses} list={list}  edit categories={categories} teachers={teachers} getList={this.getList}
                                               getObj={this.getCheckedObj}/>
                                )
                            }
                            {
                                isMultiple && (
                                    <DeleteConfirm list={list}  selectedIds={selectedRowKeys} getList={this.getList}
                                                   delete={deleteQuestion}/>
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

export default connect(mapStateToProps)(Question);