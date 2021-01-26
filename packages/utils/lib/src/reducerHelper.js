'use strict';

import immutable from 'immutable';
import Func from './func';

/**
 * @method basicReducer    
 * @param {*} state     Object  必须
 * @param {*} action    Object  必须
 * @param {*} params    Object  必须
 *  actionType          String  必须    定义的那个Type
 *  noClear             Boolean         若为 true，则在请求数据阶段不清空上次数据
 * 
 * @注 预自动生成 Reducer，除了配置 action 的相关参数外，还必须把 action 在各模块下 /action/index.js 中暴露出来
 */
export function basicReducer(state = {
    data: null,
    isRequesting: false,
    success: true,
    error: null
}, action, params) {
    const { actionType, noClear } = params;
    const { payload } = action;
    const actionTypes = Func.formatActionTypes(actionType);
    switch (action.type) {
        case actionTypes.REQUESTING:
            return immutable.fromJS(state).merge({
                isRequesting: true,
                success: true,
                data: noClear ? state.data : null,
                error: null
            }).toJS();
        case actionTypes.REQUEST_SUCCESS:
            return immutable.fromJS(state).merge({
                isRequesting: false,
                success: true,
                data: payload.data,
                error: null
            }).toJS();
        case actionTypes.REQUEST_ERROR:
            return immutable.fromJS(state).merge({
                isRequesting: false,
                success: false,
                data: null,
                error: payload.error
            }).toJS();
        case actionTypes.CLEARDATA:
            return immutable.fromJS(state).merge({
                isRequesting: false,
                success: true,
                data: null,
                error: null
            }).toJS();
        default:
            return state;
    }
}

export default {
    basicReducer
};
