import React from 'react';
import { Row, Col, Input, Table, Skeleton, Space} from "antd";
import { connect } from 'react-redux';


import "../pages.scss";
import { getParts} from "../../server/config/admin/Part";
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
            moduleId: localStorage.getItem("subjectId")
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
                title: " Набор третьих предметов",
                dataIndex: 'id',
                render: id =>
                    <Link to={`/lessons/${id}`} onClick={()=>this.handleClickedId(id)}>Набор третьих предметов</Link>
            },
        ];
    };
    handleClickedId=(id)=>{
        localStorage.setItem("partId", id);
        localStorage.setItem("moduleId", this.state.moduleId);
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
            }
        ];
    };

    getList = () => {
        const { currentPage, moduleId} = this.state;
        const current = currentPage - 1;
        getParts(moduleId).then((res) => {
            console.log(res)
            if (res&&Array.isArray(res.data&&res.data.data&&res.data.data&&res.data.data.parentsFirst)) {
                this.setState({
                    isFetching: false,
                    selectedRowKeys: [],
                    totalElements: res.data&&res.data.data&&res.data.data.parentsFirst.length,
                    list: res.data.data.parentsFirst,
                })
                let list = res.data.data.parentsFirst;
                let listColumns=[];
                list.map(function (u) {
                    let obj = {
                        id: u.id,
                        nameUz: u.nameUz,
                        nameRu: u.nameRu,
                    };
                    listColumns.push(obj);
                });
                this.setState({
                    listColumns
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
        const { list,listColumns, isFetching, totalElements, currentPage, selectedRowKeys } = this.state;
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
                            Второй набор предметов
                        </h3>
                    </Col>
                    <Col>
                        <Space>
                            <BreadcrumbCourse itemList={itemList}/>
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

                                tableLayout="fixed"
                                bordered
                                size="small"
                                rowSelection={rowSelection}
                                columns={columns}
                                dataSource={listColumns}
                                rowKey="id"
                                scroll={{ x: 700 }}
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