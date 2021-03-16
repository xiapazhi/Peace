import React from 'react'
import { Link } from 'react-router-dom'
import { Menu } from 'antd'
import { Func } from '@peace/utils'
import { NotificationOutlined } from '@ant-design/icons';
import { AuthorizationCode } from '$utils';

const { AddAppNotice, UpdateAppNotice, DeleteAppNotice } = AuthorizationCode

export function getNavItem(user, dispatch) {
    if (Func.judgeRights(AddAppNotice) || Func.judgeRights(UpdateAppNotice) || Func.judgeRights(DeleteAppNotice))
        return (
            <Menu.Item key="appMessage" icon={<NotificationOutlined />}>
                <Link to="/app/message">
                    <span>项目公告</span>
                </Link>
            </Menu.Item>
        );
    else
        return null

}