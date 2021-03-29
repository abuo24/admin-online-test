import React from 'react';
import {Row, Col, Input, Table, Skeleton, Space, Button} from "antd";
import {connect} from 'react-redux';

import ModalForm from "./components/ModalForm";
import DeleteConfirm from "../../commonComponents/DeleteConfirm";

import "../pages.scss";
import moment from "moment";
import {getCategoriesList} from "../../server/config/admin/Category";
import {deletePayment, getPayment} from "../../server/config/admin/UserInfo";
import VerifiedOutlined from "@ant-design/icons/lib/icons/VerifiedOutlined";
import AddressForm from "./components/AddressForm";
import BreadcrumbCourse from "../../commonComponents/BreadcrumbCourse";

const {Search} = Input;

class UserInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userId: localStorage.getItem("userId"),
            list: [],
            visible:false,
            selectedRowKeys: [],
            isFetching: true,
            totalElements: 0,
            currentPage: 1,
            categories: []
        }
    }
    breadCrumb = () => {
        return [
            {
                pathUrl: "/dashboard",
                pathName: `Главная`,
            },
            {
                pathUrl: "/userInfo",
                pathName: `Информация`,
            }
        ];
    };
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

    handleClickedId(id) {
        // const id = record['id'];
        localStorage.setItem("courseId", id);
    };

    onSelectedRowKeysChange = (selectedRowKeys) => {
        this.setState({selectedRowKeys});
    };

    renderColumns = () => {
        return [
            {
                title: " Ф.И.О (Русский)",
                dataIndex: 'fullName',
            },
            {
                title: " Учебный курс",
                dataIndex: 'course',
            },
            {
                title: "Дата создания",
                dataIndex: 'createAt',
            },
        ];
    };
    getList = () => {
        const {currentPage, userId} = this.state;
        getPayment(userId).then((res) => {
            if (res && Array.isArray(res.data)) {
                let list = [];
                res.data.map(function (payment) {
                    let fullName = payment.userReq ? (payment.userReq.firstName + '/' + payment.userReq.lastName) : '';
                    let course = payment.courseReq ? payment.courseReq.titleRu : '';
                    let obj = {
                        id: payment.id,
                        fullName,
                        course,
                        modules: payment.modules,
                        createAt:moment(payment.createAt).format("YYYY-MM-DD / HH:mm:ss")
                    };
                    list.push(obj);
                });
                this.setState({
                    isFetching: false,
                    selectedRowKeys: [],
                    list,
                })
            } else {
                this.setState({
                    selectedRowKeys: [],
                    isFetching: false,
                })
            }
        });
    };
    getCollections = () => {
        getCategoriesList().then(res => {
            this.setState({
                categories: res.data
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
    showModal=(value)=>{
        this.setState({
            visible:value
        })
    };

    render() {
        const {
            userId,
            list,
            selectedRowKeys,
            isFetching,
            categories,
            totalElements,
            currentPage,
            visible
        } = this.state;
        const columns = this.renderColumns();

        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectedRowKeysChange,
        };
        const itemList = this.breadCrumb();

        const isMultiple = selectedRowKeys.length > 1 ? true : false;
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
                            <BreadcrumbCourse itemList={itemList}/>
                            <Button type="primary" onClick={()=>this.showModal(true)} title={"Адрес"}>
                                <VerifiedOutlined />
                            </Button>
                            <AddressForm visible={visible} showModal={this.showModal}/>
                            <ModalForm categories={categories} getList={this.getList}/>
                            {
                                isSingle && (
                                    <ModalForm edit categories={categories} getList={this.getList}
                                               getObj={this.getCheckedObj}/>
                                )
                            }
                            {
                                isSingle && (
                                    <DeleteConfirm selectedIds={selectedRowKeys} getList={this.getList}
                                                   delete={deletePayment}/>
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
                            dataSource={list}
                            rowKey="id"
                            scroll={{x: 1000}}
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
};

export default connect(mapStateToProps)(UserInfo);