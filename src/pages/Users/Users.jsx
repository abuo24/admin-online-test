import React from 'react';
import {Row, Col, Input, Table, Skeleton, Space, Radio, Button} from "antd";
import { connect } from 'react-redux';

import ModalForm from "./components/ModalForm";
import DeleteConfirm from "../../commonComponents/DeleteConfirm";
import { paginationDefaultItemCount } from "../../constants";

import "../pages.scss";
import {deleteUser, getUsers} from "../../server/config/admin/Users";
import {Link} from "react-router-dom";
import {getCourses} from "../../server/config/admin/Course";
import moment from "moment";
import {host, port} from "../../server/host";
import avatar from "../../assets/img/no-picture.jpg";
import {deleteTeacher, getTeachers} from "../../server/config/admin/Teacher";
const { Search } = Input;

class Users extends React.Component {
    constructor() {
        super();
        this.state = {
            list: [],
            selectedRowKeys: [],
            isFetching: true,
            totalElements: 0,
            currentPage: 1,
            userType:'student',
            listColumns:[],
            courses:[]
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

    renderStudentColumns = () => {
        return [
            {
                title:"Студент",
                dataIndex: 'hashCode',
                render: (hashCode) => {
                    return (
                        <div className="profile-img-box">
                            {hashCode ?
                                <img src={host + ':' + port + '/api/client/file/preview/' + hashCode}
                                     alt="Img error"/> :
                                <img src={avatar} alt="Img error"/>
                            }
                        </div>
                    );

                }
            },
            {
                title:"Ф.И.О",
                dataIndex: 'fullName',
            },
            {
                title:"Тел Номер",
                dataIndex: 'phoneNumber',
            },
            {
                title:"Актив",
                dataIndex: 'active',
                render: (active) => {
                    return (
                        <div >
                            {active ?"Истина":"Ложь"}
                        </div>
                    );

                }
            },
            {
                title:"Дата создания",
                dataIndex: 'createAt',
            },
            {
                title: " Инфо",
                dataIndex: 'id',
                render: id =>
                    <Link to={`/userInfo/${id}`} onClick={()=>this.handleClickedId(id)}>Инфо</Link>
            },
        ];
    };
    handleClickedId=(id)=>{
        localStorage.setItem("userId", id);
    };
    renderTeacherColumns = () => {
        return [
            {
                title:"Учителя",
                dataIndex: 'hashCode',
                render: (hashCode) => {
                    return (
                        <div className="profile-img-box">
                            {hashCode ?
                                <img src={host + ':' + port + '/api/client/file/preview/' + hashCode}
                                     alt="Img error"/> :
                                <img src={avatar} alt="Img error"/>
                            }
                        </div>
                    );

                }
            },
            {
                title:"Ф.И.О",
                dataIndex: 'fullName',
            },
            {
                title:"Тел Номер",
                dataIndex: 'phoneNumber',
            },
            {
                title:" Telegram",
                dataIndex: 'telegram',
            },
            {
                title:" Instagram",
                dataIndex: 'instagram',
            },
            {
                title:" Facebook",
                dataIndex: 'facebook',
            },
            {
                title:"Актив",
                dataIndex: 'active',
                render: (active) => {
                    return (
                        <div >
                            {active ?"Истина":"Ложь"}
                        </div>
                    );

                }
            },
            {
                title:"Дата создания",
                dataIndex: 'createAt',
            },

        ];
    };

    getStudentList = () => {
        const { currentPage } = this.state;
        const current = currentPage - 1;
        if (current >= 0) {{
                getUsers(current, paginationDefaultItemCount).then((res) => {
                    if (res&&Array.isArray(res.data.content)) {
                        let list = res.data.content;
                        let listColumns=[];
                        list.map(function (u) {
                            let obj = {
                                id: u.id,
                                fullName: u.firstName+' '+u.lastName,
                                active:u.accountNonLocked,
                                phoneNumber: u.phoneNumber,
                                hashCode:u.attachment?u.attachment.hashCode:'',
                                createAt: moment(u.createAt).format("YYYY-MM-DD / HH:mm:ss"),
                            };
                            listColumns.push(obj);
                        });
                        this.setState({
                            isFetching: false,
                            selectedRowKeys: [],
                            totalElements: res.data.totalElements,
                            listColumns,
                            list,
                        })
                    } else {
                        this.setState({
                            selectedRowKeys: [],
                            isFetching: false,
                        })
                    }
                });
            this.setState({
                isFetching: false,
                selectedRowKeys: [],
                totalElements: 0,
                list:[],
                listColumns:[]
            })
            }
        }
    };

    getTeacherList = () => {
        const { currentPage } = this.state;
        const current = currentPage - 1;
        if (current >= 0) {{
            getTeachers(current, paginationDefaultItemCount).then((res) => {
                if (res&&Array.isArray(res.data.content)) {
                    let list = res.data.content;
                    let listColumns=[];
                    list.map(function (u) {
                        let obj = {
                            id: u.id,
                            fullName: u.firstName+' '+u.lastName,
                            active:u.accountNonLocked,
                            phoneNumber: u.phoneNumber,
                            hashCode:u.attachment?u.attachment.hashCode:'',
                            telegram:u.telegram,
                            instagram:u.instagram,
                            facebook:u.facebook,
                            createAt: moment(u.createAt).format("YYYY-MM-DD / HH:mm:ss"),
                        };
                        listColumns.push(obj);
                    });
                    this.setState({
                        isFetching: false,
                        selectedRowKeys: [],
                        totalElements: res.data.totalElements,
                        listColumns,
                        list,
                    })
                } else {
                    this.setState({
                        selectedRowKeys: [],
                        isFetching: false,
                    })
                }
            });
            this.setState({
                isFetching: false,
                selectedRowKeys: [],
                totalElements: 0,
                list:[],
                listColumns:[]
            })
        }
        }
    };

    getCollections=()=>{
        getCourses().then(res=>{
            if (res&&Array.isArray(res.data)) {
                this.setState({
                    courses: res.data
                })
            }
        });
        const {userType} = this.state;
        userType === 'student' ? (this.getStudentList()):(this.getTeacherList())
    };

    handlePaginationChange = (page) => {
        const {userType} = this.state;
        userType === 'student' ? (this.setState({
                currentPage: page,
            }, () => this.getStudentList()))
            :
            (this.setState({
                currentPage: page,
            }, () => this.getTeacherList()))
    };

    componentDidMount() {
        this.getCollections();
    }
    handleSizeChange = e => {
        e.target.value==='student'?this.getStudentList():this.getTeacherList();
        this.setState({
            userType: e.target.value,
        });
    };

    render() {
        const {
            list,
            isFetching,
            totalElements,
            currentPage,
            selectedRowKeys,
            courses,
            listColumns,
            userType
        } = this.state;
        const studentColumns = this.renderStudentColumns();
        const teacherColumns = this.renderTeacherColumns();

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
                                {userType==='student'?'Студенты':'Учителя'}
                            </h3>
                        </Space>
                    </Col>
                    <Col>
                        <Space style={{marginRight:'1vh'}}>
                            <Radio.Group value={userType} onChange={this.handleSizeChange}>
                                <Radio.Button value="student">Студенты</Radio.Button>
                                <Radio.Button value="teacher">Учителя</Radio.Button>
                            </Radio.Group>
                        </Space>
                        <Button href={`${host}:${port}`+'/api/client/excel/users'} style={{marginRight:'1vh'}}>
                            Excel
                        </Button>
                        <Space>
                            <ModalForm courses={courses}
                                       getList={userType==='student'?this.getStudentList:this.getTeacherList}
                                       userType={userType}
                            />

                            {
                                isSingle && (
                                    <ModalForm edit courses={courses}
                                               getList={userType==='student'?this.getStudentList:this.getTeacherList}
                                               getObj={this.getCheckedObj}
                                               userType={userType}
                                    />

                                )
                            }
                            {
                                isMultiple && (
                                    <DeleteConfirm selectedIds={selectedRowKeys}
                                                   getList={userType==='student'?this.getStudentList:this.getTeacherList}
                                                   delete={userType==='student'?deleteUser:deleteTeacher} />
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
                                columns={userType==='student'?studentColumns:teacherColumns}
                                dataSource={listColumns}
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

export default connect(mapStateToProps)(Users);