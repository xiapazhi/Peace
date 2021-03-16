import { ApiTable } from '$utils';
import { basicAction } from '@peace/utils'

export function getNoticeList(userId) {
    return dispatch => basicAction({
        type: 'get',
        dispatch: dispatch,
        actionType: 'NOTICE_LIST_REQUEST',
        url: ApiTable.getMessages.replace('{userId}', userId),
        msg: {
            error: '获取系统通知失败'
        },
        reducer: {
            name: 'notice'
        }
    });
}

export function editNoticeList(contentId) {
    return dispatch => basicAction({
        type: 'post',
        data: {},
        dispatch: dispatch,
        actionType: 'MODIFY_ONE',
        url: ApiTable.modifyOneMessage.replace('{messageId}', contentId),
    });
}

export function RemoveAllNotice(userId) {
    return dispatch => basicAction({
        type: 'post',
        data: {},
        dispatch: dispatch,
        actionType: 'MODIFY_ALL',
        url: ApiTable.modifyAllMessage.replace('{userId}', userId),
    });
}

export default {
    getNoticeList,
    editNoticeList,
    RemoveAllNotice
}