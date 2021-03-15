'use strict'

import React from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'antd';
import { AuthorizationCode } from '$utils';
import { Func } from '@peace/utils'
import { TeamOutlined } from '@ant-design/icons';

const { SubMenu, Item } = Menu;
const { ModifyDepartmentResource, ModifyPositionResource } = AuthorizationCode;

export function getNavItem(user, dispatch) {
    return (
        <SubMenu key="authorization" icon={<TeamOutlined />} title={
            <span>授权管理</span>
        }>
            <Item key="member"><Link to="/authorization/member">部门成员</Link></Item>
            {Func.judgeRights(ModifyPositionResource, <Item key="resource"><Link to="/authorization/resource">系统资源</Link></Item>)}
            {Func.judgeRights(ModifyDepartmentResource, <Item key="thing"><Link to="/authorization/thing">监测范围</Link></Item>)}
        </SubMenu>
    );
}
