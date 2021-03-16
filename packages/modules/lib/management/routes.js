'use strict';
import { Company } from './containers';

export default [
    {
        type: 'inner',
        route: {
            path: '/management',
            component: null,
            breadcrumbName: '系统管理',
            childRoutes: [{
                breadcrumbName: '企业设置',
                path: '/company',
                component: Company
            }]
        }
    }
];