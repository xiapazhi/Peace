import { basicAction } from '@peace/utils'
import { ApiTable } from '$utils'

export function getEnterprisesDetails(userId) {
    return dispatch => basicAction({
        type: 'get',
        dispatch: dispatch,
        actionType: 'GET_ENTERPRISERS_DETAILS',
        url: ApiTable.getEnterprisesDetails.replace('{userId}', userId),
        msg: {
            error: '获取企业信息失败'
        },
        reducer: {
            name: 'enterprises'
        }
    });
}

export function getStructureResources(orgId) {
    return dispatch => basicAction({
        type: 'get',
        dispatch: dispatch,
        actionType: 'GET_STRUCTURE_RESOURCES_RANGE',
        url: ApiTable.getStructsList.replace('{organizationId}', orgId) + '?constraintAll=true',
        msg: {
            error: '数据范围列表获取失败'
        },
        reducer: {
            name: 'structures'
        }
    });
}

export function getDepartmentResources(orgId) {
    return dispatch => basicAction({
        type: 'get',
        dispatch: dispatch,
        actionType: 'GET_DEPARTMENT_RESOURCES',
        url: ApiTable.getDepartmentResources.replace('{orgId}', orgId),
        msg: {
            error: '数据范围列表获取失败'
        },
        reducer: {
            name: 'departmentResources'
        }
    });
}

export function modifyDepartmentResources(departmentId, roleId, userId, data) {
    return dispatch => basicAction({
        type: 'post',
        dispatch: dispatch,
        data,
        actionType: 'MODIFY_DEPARTMENT_RESOURCES',
        url: ApiTable.modifyDepartmentResources.replace('{departmentId}', departmentId)
            + "?platform=true&"
            + (roleId ? `roleId=${roleId}&` : '')
            + (userId ? `userId=${userId}` : ''),
        msg: {
            option: '修改数据范围'
        }
    });
}

export function getAuthorList(orgId, user) {
    return dispatch => basicAction({
        type: 'get',
        dispatch: dispatch,
        actionType: 'GET_AUTHOR',
        url: ApiTable.getEnterprisesMembers.replace('{enterpriseId}', orgId),
        msg: {
            error: '获取部门职位信息失败'
        },
        reducer: {
            name: 'authorData',
            params: {
                noClear: true
            }
        },
        callback: (res => {
            if (user && user.departmentName && user.departmentName != '默认') {
                return res.filter(m => m.departmentName == user.departmentName);
            } else {
                if (res.length && res[0].departmentName != '默认') {
                    let defaultIndex = res.findIndex(r => r.departmentName == '默认');
                    if (defaultIndex > 0) {
                        let defaultDep = res[defaultIndex]
                        res.splice(defaultIndex, 1)
                        res.unshift(defaultDep)
                    }
                }
                return res
            }
        })
    });
}

export function getAuthors(orgId) {
    return dispatch => basicAction({
        type: 'get',
        dispatch: dispatch,
        actionType: 'GET_AUTHORLIST',
        url: ApiTable.getAuthorList.replace('{orgId}', orgId),
        msg: {
            error: '获取权限信息失败'
        },
        reducer: {
            name: 'authors'
        }
    });
}

export function modifyAuthor(postId, params) {
    return dispatch => basicAction({
        type: 'post',
        data: params,
        dispatch: dispatch,
        actionType: 'MODIFY_AUTHORLIST',
        url: ApiTable.modifyAuthor.replace('{postId}', postId),
        msg: {
            success: '修改权限成功,重新登录后生效',
            error: '修改权限信息失败'
        },
    });
}

export default {
    getEnterprisesDetails,
    getAuthorList,
    getAuthors,
    getStructureResources,
    getDepartmentResources
}