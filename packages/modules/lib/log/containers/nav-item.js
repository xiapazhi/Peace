'use strict';
import React from 'react';
import { Menu } from 'antd';
import { Link } from 'react-router-dom';
import { FileTextOutlined } from '@ant-design/icons';

export function getNavItem(user, dispatch) {
    return (
        <Menu.Item key="log" icon={<FileTextOutlined />}>
            <Link to="/log/list">
                <span>用户日志</span>
            </Link>
        </Menu.Item>
    )
}