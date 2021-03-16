'use strict';

import routes from './routes';
import reducers from './reducers';
import actions from './actions';
import {getNavItem} from './containers/nav-item';
//2021
export default {
    key: 'management',
    name: '系统管理',
    reducers: reducers,
    routes: routes,
    actions: actions,
    getNavItem: getNavItem
};