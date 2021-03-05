'use strict';
import Func from './func';
import { Request } from './webapi';

/**
 * @method clearData                    清空数据
 * @param {*} dispatch  
 * @param {*} opts      Object  必须
 *  actionType          String  必须
 */
export function clearData(dispatch, opts) {
    const { actionType } = opts;
    const actionTypes = Func.formatActionTypes(actionType);
    return dispatch({ type: actionTypes.CLEARDATA });
}

/**
 * @method httpGet
 * @param {*} dispatch  
 * @param {*} opts      Object  必须
 *  url                 String  必须    请求路由
 *  query               Object          请求参数
 *  actionType          String  必须
 *  msg                 Object          成功/失败提示信息，优先级次于接口 body.message
 *      success         String          成功
 *      error           String          失败
 *  callback            Function            对于返回数据预处理的回调，返回值作为 action 的 payload 的 data 即 reducer 的 data 返回（所以记得写 return 哦！）
 */
export function httpGet(dispatch, opts) {
    const { url, query, actionType, msg, callback } = opts;
    const actionTypes = Func.formatActionTypes(actionType);
    dispatch({ type: actionTypes.REQUESTING });
    return Request.get(url, query).then(data => {
        if (callback) {
            data = callback(data)
        }
        return dispatch({
            type: actionTypes.REQUEST_SUCCESS,
            success: true,
            payload: { data: data }
        });
    }, err => errCallback(err, dispatch, actionTypes, msg));
}

/**
 * @method httpPost                    
 * @param {*} dispatch  
 * @param {*} opts      Object      必须
 *  url                 String      必须    请求路由
 *  data                Object              请求数据
 *  query               Object              请求参数
 *  actionType          String      必须
 *  msg                 Object              成功/失败提示信息，优先级次于接口 body.message
 *      success         String              成功
 *      error           String              失败
 *  callback            Function            对于返回数据预处理的回调，返回值作为 action 的 payload 的 data 即 reducer 的 data 返回（所以记得写 return 哦！）
 *  msgSuccessShow      Boolean             请求成功提示信息展示，默认true
 */
export function httpPost(dispatch, opts) {
    const { url, data, query, actionType, msg, callback, msgSuccessShow = true } = opts;
    const actionTypes = Func.formatActionTypes(actionType);
    dispatch({ type: actionTypes.REQUESTING });
    return Request.post(url, data || {}, query).then(res => {
        if (callback) {
            res = callback(res)
        }
        const options = {
            type: actionTypes.REQUEST_SUCCESS,
            success: true,
            payload: { data: res, message: msg.success },
            done: msg.success
        };
        if (!msgSuccessShow) {
            delete options["done"];
        }
        return dispatch(options);
    }, err => errCallback(err, dispatch, actionTypes, msg));
}

/**
 * @method httpPut                    
 * @param {*} dispatch  
 * @param {*} opts      Object  必须
 *  url                 String  必须    请求路由
 *  data                Object          请求数据
 *  actionType          String  必须
 *  msg                 Object          成功/失败提示信息，优先级次于接口 body.message
 *      success         String          成功
 *      error           String          失败
 *  callback            Function            对于返回数据预处理的回调，返回值作为 action 的 payload 的 data 即 reducer 的 data 返回（所以记得写 return 哦！）
 */
export function httpPut(dispatch, opts) {
    const { url, data, actionType, msg, callback } = opts;
    const actionTypes = Func.formatActionTypes(actionType);
    dispatch({ type: actionTypes.REQUESTING });
    return Request.put(url, data || {}).then(res => {
        if (callback) {
            res = callback(res)
        }
        return dispatch({
            type: actionTypes.REQUEST_SUCCESS,
            success: true,
            payload: {
                data: res,
                message: msg.success
            },
            done: msg.success
        });
    }, err => errCallback(err, dispatch, actionTypes, msg));
}

/**
 * @method httpDel                    
 * @param {*} dispatch  
 * @param {*} opts      Object  必须
 *  url                 String  必须    请求路由
 *  actionType          String  必须
 *  msg                 Object          成功/失败提示信息，优先级次于接口 body.message
 *      success         String          成功
 *      error           String          失败
 */
export function httpDel(dispatch, opts) {
    const { url, actionType, msg, query } = opts;
    const actionTypes = Func.formatActionTypes(actionType);
    dispatch({ type: actionTypes.REQUESTING });
    return Request.delete(url, query).then(res => {
        return dispatch({
            type: actionTypes.REQUEST_SUCCESS,
            success: true,
            payload: { message: msg.success },
            done: msg.success
        });
    }, err => errCallback(err, dispatch, actionTypes, msg));
}

/**
 * @method errCallback  
 * @param {*} err           Object  必须    接口返回的错误信息
 *  body                    Object         
 *   message                String
 * @param {*} dispatch              必须
 * @param {*} actionTypes   Object  必须
 * @param {*} msg           Object  必须
 *  error                   String  必须
 */
export function errCallback(err, dispatch, actionTypes, msg) {
    const { body } = err.response;
    let message = body && body.message ? body.message : msg.error;
    return dispatch({
        type: actionTypes.REQUEST_ERROR,
        success: false,
        payload: { error: message },
        error: message,
    });
}

/**
 * @method basicAction  
 * @param {*} params     
 *      type                String  必须  get|post|put|del 指定类型
 *      dispatch                    必须
 *      get|post|put|del                  按 type 所需要的参数一并传递
 *        msg
 *          option          String        如若传 option ，则自动拼接为 success，error
 *      initReducer         Boolean       true 则自动生成 reducer()
 *      reducer             Object        生成 reducer() 相关参数
 *        name              String        指定生成 reducer() 的名称
 *        params            Object        见 reducerHelp/basicReducer params 参数
 */
export function basicAction(params) {
    const { dispatch, type, msg } = params;
    if (msg && msg.option) {
        params.msg = {
            success: msg.option + '成功',
            error: msg.option + '失败'
        }
    }
    if (dispatch) {
        switch (type) {
            case 'get':
                return httpGet(dispatch, params)
            case 'post':
                return httpPost(dispatch, params)
            case 'put':
                return httpPut(dispatch, params)
            case 'del':
            case 'delete':
                return httpDel(dispatch, params)
            default:
                throw 'Action type 不属于 get|post|put|del|delete 任一'
        }
    } else {
        return params
    }
}

export default {
    clearData,
    httpGet,
    httpPost,
    httpPut,
    httpDel,
    basicAction
};
