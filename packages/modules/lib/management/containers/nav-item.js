import React from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'antd';
import { SettingOutlined } from '@ant-design/icons';

const SubMenu = Menu.SubMenu;

export function getNavItem(user, dispatch) {
    return (
        <SubMenu key="management" icon={<SettingOutlined />} title={
            <span>系统管理</span>
        }>
            <Menu.Item key="company">
                <Link to="/management/company">企业设置</Link>
            </Menu.Item>
        </SubMenu>
    );
}