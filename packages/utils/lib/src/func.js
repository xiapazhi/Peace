'use strict';
import { PinyinHelper } from './pinyin';

export default class Func {
    static formatActionTypes(actionTypes) {
        if (!actionTypes) throw new Error('actionType 必传');
        if (typeof (actionTypes) == 'string') {
            return {
                REQUESTING: `REQUEST_${actionTypes}`,
                REQUEST_SUCCESS: `${actionTypes}_SUCCESS`,
                REQUEST_ERROR: `${actionTypes}_ERROR`,
                CLEARDATA: `${actionTypes}_CLEAR`,
            }
        } else {
            return actionTypes
        }
    };

    static judgeRights(authorizationCode, dom = null) {
        const userInfo = JSON.parse(sessionStorage.getItem('user'));
        const { portal, resources } = userInfo;
        let judgeRslt = false;
        if (portal == 'A') {
            judgeRslt = true;
        } else if (typeof (authorizationCode) == 'object') {
            judgeRslt = authorizationCode.some(a => {
                return resources.includes(a)
            })
        } else {
            judgeRslt = resources.includes(authorizationCode);
        }
        if (dom) {
            return judgeRslt ? dom : '';
        } else {
            return judgeRslt
        }
    }

    static selectFilterOption(input, option) {
        let v = input.toLowerCase();
        let src = option.children.toLowerCase();
        return src.includes(v) || PinyinHelper.isPinyinMatched(src, v);
    }
};