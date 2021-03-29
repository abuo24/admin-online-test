import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Menu, Drawer, Button } from 'antd';
import {
    ReadOutlined,
    AppstoreOutlined,
    ScheduleOutlined,
    OrderedListOutlined,
    FileDoneOutlined,
    MenuOutlined,
    AuditOutlined,
} from '@ant-design/icons';

import { connect } from 'react-redux';

const menus = [
    {
        path: '/dashboard',
        label: "Пользователи",
        icon: <AppstoreOutlined />,
    },
    {
        path: '/followers',
        label: " Подписчики",
        icon: <ReadOutlined />,
    },
    {
        path: '/messages',
        label: "Сообщения",
        icon: <ScheduleOutlined />,
    },
    {
        path: '/file',
        label: "Файлы",
        icon: <FileDoneOutlined />,
    },
    {
        path: '/category',
        label: "Категории курсов",
        icon: <OrderedListOutlined />,
    },
    {
        path: '/course',
        label: " Учебные курсы",
        icon: <AuditOutlined />,
    },

];

class HorizontalMenus extends React.Component {
    state = {
        current: this.props.location.pathname,
        isDrawerOpen: false,
    };

    openDrawer = () => this.setState({ isDrawerOpen: true });

    closeDrawer = () => this.setState({ isDrawerOpen: false });

    handleClick = e => {
        this.setState({ current: e.key });
    };
    render() {
        const { current, isDrawerOpen } = this.state;

        return (
            <React.Fragment>
                <Menu className="visible-md visible-lg" onClick={this.handleClick} selectedKeys={[current]}
                      mode="horizontal">
                    {
                        menus.map((menu) => (
                                        <Menu.Item key={menu.path} >
                                            <Link to={menu.path}>
                                                {menu.icon}
                                                {menu.label}
                                            </Link>
                                        </Menu.Item>
                                )
                        )
                    }
                </Menu>

                <Button onClick={this.openDrawer} className="visible-xs visible-sm drawer-btn">
                    <MenuOutlined />
                </Button>

                <Drawer
                    title={"Меню"}
                    placement="right"
                    onClose={this.closeDrawer}
                    visible={isDrawerOpen}
                    bodyStyle={{
                        padding: 0
                    }}
                >
                    <Menu mode="inline" onClick={this.handleClick} selectedKeys={[current]}>
                        {
                            menus.map((menu) => (
                                            <Menu.Item key={menu.path} >
                                                <Link to={menu.path}>
                                                    {menu.icon}
                                                    {menu.label}
                                                </Link>
                                            </Menu.Item>
                                    )
                            )
                        }
                    </Menu>
                </Drawer>
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => {
    return {
    }
}

export default withRouter(connect(mapStateToProps)(HorizontalMenus));