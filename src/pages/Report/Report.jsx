import React from 'react';
import { Row, Col,  Skeleton } from "antd";
import { connect } from 'react-redux';
import './report.scss'
import {reportUser} from "../../server/config/admin/Users";
import {FilePdfOutlined} from '@ant-design/icons'
import {host, port} from "../../server/host";
class Report extends React.Component {
    constructor() {
        super();
        this.state = {
           data: {},
            isFetching: true,
        }
    }

    getList = () => {

        reportUser(window.location.pathname.slice(8)).then((res) => {
            if (res) {
                this.setState({
                    isFetching: false,
                   data:res.data
                })
            } else {
                this.setState({
                    isFetching: false,
                })
            }
        })
    }



    componentDidMount() {
        this.getList();
    }

    render() {
        const {isFetching,data}=this.state

        return (
            <div   className="bg-white site-border " style={{padding:'40px'}}>
                <Row align="middle" justify="space-between" className="page-header site-border-bottom">
                    <Col>
                        <h1>
                            Подтверждение результата теста COVID-19
                        </h1>
                    </Col>
                </Row>

                {
                    isFetching ? (
                        <Skeleton active />
                    ) : (
                        <div>
                            <table id="customers">
                                <tr>
                                    <th>Полное имя</th>
                                    <td>{data.fullname}</td>
                                </tr>
                                <tr>
                                    <th>Дата рождения</th>
                                    <td>{data.birthday}</td>
                                </tr>
                                <tr>
                                    <th>Пол</th>
                                    <td>{data.sex}</td>
                                </tr>
                                <tr>
                                    <th>Адрес</th>
                                    <td>{data.address}</td>
                                </tr>
                            </table>


                            <h2 style={{marginTop:'30px'}}>Анализ</h2>

                            <table id="customers">
                                <tr>
                                    <th>Номер</th>
                                    <th>Дата регистрации</th>
                                    <th>Статус</th>
                                    <th>Метод исследования	</th>
                                    <th>Лаборатория</th>
                                    <th>Станция</th>
                                    <th>Распечатать</th>
                                </tr>
                                <tr>
                                    <td>{data.id}</td>
                                    <td>{data.signinAnaliz}</td>
                                    <td>{data.status}</td>
                                    <td>{data.research}</td>
                                    <td>{data.laboratory}</td>
                                    <td>{data.sampling}</td>
                                    <td style={{textAlign:'center'}}><a style={{fontSize:'20px'}} target="_blank" href={host+':'+port+'/api/auth/file/report/'+window.location.pathname.slice(8)}><FilePdfOutlined /></a></td>
                                </tr>

                            </table>
                        </div>
                    )
                }
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {

    }
}

export default connect(mapStateToProps)(Report);