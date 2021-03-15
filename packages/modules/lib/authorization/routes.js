'use strict'

import {
    Member,
    Resource,
    Thing
} from './containers';

export default [{
    type: 'inner',
    route: {
        path: '/authorization',
        component: null,
        breadcrumbName: '授权管理',
        childRoutes: [{
            breadcrumbName: '部门成员',
            path: '/member',
            component: Member
        }, {
            breadcrumbName: '系统资源',
            path: '/resource',
            component: Resource
        }, {
            breadcrumbName: '监测范围',
            path: '/thing',
            component: Thing
        }]
    }
}];

