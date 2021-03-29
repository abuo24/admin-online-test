import React from 'react';
import { connect } from "react-redux";
import { Modal, Button, Row, Col, message } from 'antd';
import { DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

class DeleteConfirm extends React.Component {
    state = { visible: false, isSubmitting: false };

    showModal = () => {
        this.setState({
            visible: true,
        });
    };

    handleOk = () => {
        this.setState({ isSubmitting: true });
        this.props.selectedIds.map(item=>{
            this.props.delete(item).then((res) => {
                if (res) {
                    this.setState({ isSubmitting: false, visible: false });
                    this.props.getList();
                    res.data.success?message.success(res.data.message):message.error(res.data.message);
                } else {
                    this.setState({ isSubmitting: false, visible: false });
                }
            })
        });
    };

    handleCancel = () => {
        this.setState({
            visible: false,
        });
    };

    render() {
        const { isSubmitting, visible } = this.state;


        return (
            <React.Fragment>
                <Button danger onClick={this.showModal}>
                    <DeleteOutlined />
                </Button>
                <Modal
                    title={"delete"}
                    centered
                    width={350}
                    visible={visible}
                    onOk={this.handleOk}
                    okType="danger"
                    okText={"delete"}
                    cancelText={"cancel"}
                    confirmLoading={isSubmitting}
                    onCancel={this.handleCancel}
                >
                    <Row align="middle" gutter={[8]}>
                        <Col>
                            <ExclamationCircleOutlined style={{ color: "orange", fontSize: "20px" }} />
                        </Col>
                        <Col>
                            {"Вы действительно хотите удалить этот элемент?"}
                        </Col>
                    </Row>
                </Modal>
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => {
    return {

    }
};

export default connect(mapStateToProps)(DeleteConfirm);