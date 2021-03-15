'use strict'

import actions from './actions';
import reducers from './reducers';
import routes from './routes';
import { getNavItem } from './containers/nav-item'

export default {
    key: 'authorization',
    name: '授权管理',
    actions: actions,
    reducers: reducers,
    routes: routes,
    getNavItem: getNavItem,
}

