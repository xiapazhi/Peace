import { ApiTable } from '$utils';
import { basicAction } from '@peace/utils'

export function getProjectList(userId, resourceControl) {
    return dispatch => basicAction({
        type: 'get',
        dispatch: dispatch,
        actionType: 'GET_PROJECT_LIST',
        url: ApiTable.getProjects.replace('{userId}', userId) + (resourceControl ? '?resourceControl=true' : ''),
        msg: {
            error: '获取项目信息失败'
        },
        reducer: { name: 'projectList' }
    });
}

export function getAuthor(orgId, user) {
    return dispatch => basicAction({
        type: 'get',
        dispatch: dispatch,
        actionType: 'GET_AUTHOR2',
        url: ApiTable.getEnterprisesMembers.replace('{enterpriseId}', orgId),
        msg: {
            error: '获取部门职位信息失败'
        },
        reducer: {
            name: 'author',
        },
    });
}

export function getAppMessage(query) {
    return dispatch => basicAction({
        type: 'get',
        query,
        dispatch: dispatch,
        actionType: 'APP_MESSAGE_REQUEST',
        url: ApiTable.appMessages,
        msg: {
            error: '查询项目公告失败'
        },
        reducer: {
            name: 'appMessage'
        }
    });
}

export function createAppMessage(data) {
    return dispatch => basicAction({
        type: 'post',
        data,
        dispatch: dispatch,
        actionType: 'ADD_APP_MESSAGE_REQUEST',
        url: ApiTable.appMessages,
        msg: {
            option: '创建项目公告'
        },
    });
}

export function editAppMessage(id, data) {
    return dispatch => basicAction({
        type: 'put',
        data: Object.assign({}, data, { id }),
        dispatch: dispatch,
        actionType: 'MODIFY_APP_MESSAGE_REQUEST',
        url: ApiTable.appMessages,
        msg: {
            option: '修改项目公告'
        },
    });
}

export function removeAppMessage(id) {
    return dispatch => basicAction({
        type: 'del',
        dispatch: dispatch,
        actionType: 'MODIFY_APP_MESSAGE_REQUEST',
        url: ApiTable.appMessages + '?id=' + id,
        msg: {
            option: '删除项目公告'
        },
    });
}

export default {
    getProjectList, getAuthor,
    getAppMessage, createAppMessage, editAppMessage, removeAppMessage
}