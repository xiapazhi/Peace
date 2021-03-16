'use strict';

import routes from './routes';
import reducers from './reducers';
import actions from './actions';
import { getNavItem } from './containers/nav-item';

export default function entry(opts) {
    const { ...rest } = Object.assign({}, { AuthorizationCode: null }, opts);

    console.log(opts);
    global.fs = global.fs || {};
    global.fs.notification = { ...rest };
    return {
        key: 'notification',
        name: '消息',
        reducers: reducers,
        routes: routes,
        actions: actions,
        getNavItem: getNavItem
    }
};