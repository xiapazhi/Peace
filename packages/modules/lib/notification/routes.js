'use strict';
import { SystemNotice, AppNotice } from './containers';


export default [
    {
        type: 'inner',
        route: {
            path: '/notification/systemNotice',
            exact: true,
            key: 'systemNotice',
            breadcrumbName: '系统通知',
            component: SystemNotice,
        }
    },
    {
        type: 'inner',
        route: {
            path: '/app/message',
            breadcrumbName: '应用公告',
            component: AppNotice
        }
    }
];