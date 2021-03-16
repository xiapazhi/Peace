'use strict';
import { Log } from './containers';

export default [{
    type: 'inner',
    route: {
        path: '/log/list',
        exact: true,
        key: 'log',
        breadcrumbName: '用户日志',
        component: Log,
    }
}];