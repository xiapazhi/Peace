'use strict';

import { ApiTable } from '$utils';
import { basicAction } from '@peace/utils'

export function getLogInfo(userId, data) {
    return dispatch => basicAction({
        type: 'post',
        data,
        dispatch: dispatch,
        actionType: 'LOG_INFO_REQUEST',
        url: ApiTable.getLogInfo.replace('{userId}', userId),
        msg: {
            error: '获取日志信息失败'
        },
        reducer: {
            name: 'log'
        }
    });
}

export default {
    getLogInfo
}