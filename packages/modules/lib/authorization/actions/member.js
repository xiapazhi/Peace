import { ApiTable } from '$utils';
import { basicAction } from '@peace/utils';

export function addDepartment(id, params) {
    return dispatch => basicAction({
        type: 'post',
        data: params,
        dispatch: dispatch,
        actionType: 'ADD_DEPARTMENT',
        url: ApiTable.addDepartment.replace('{enterpriseId}', id),
        msg: {
            option: '新增部门'
        },
    });
}

export function addPost(id, params) {
    return dispatch => basicAction({
        type: 'post',
        data: params,
        dispatch: dispatch,
        actionType: 'ADD_POST',
        url: ApiTable.addPost.replace('{departmentId}', id),
        msg: {
            option: '新增职位'
        },
    });
}

export function deleteDepartment(id) {
    return dispatch => basicAction({
        type: 'del',
        dispatch: dispatch,
        actionType: 'DELETE_DEPARTMENT',
        url: ApiTable.deleteDepartment.replace('{departmentId}', id),
        msg: {
            option: '删除部门'
        },
    });
}

export function deletePost(id) {
    return dispatch => basicAction({
        type: 'del',
        dispatch: dispatch,
        actionType: 'DELETE_POST',
        url: ApiTable.deletePost.replace('{postId}', id),
        msg: {
            option: '删除职位'
        },
    });
}

export function modifyPost(id, params) {
    return dispatch => basicAction({
        type: 'put',
        data: params,
        dispatch: dispatch,
        actionType: 'MODIFY_POST',
        url: ApiTable.modifyPost.replace('{postId}', id),
        msg: {
            option: '修改职位'
        },
    });
}

export function modifyDepartment(id, params) {
    return dispatch => basicAction({
        type: 'put',
        data: params,
        dispatch: dispatch,
        actionType: 'MODIFY_DEPARTMENT',
        url: ApiTable.modifyDepartment.replace('{departmentId}', id),
        msg: {
            option: '修改部门名称'
        },
    });
}

export function addMembers(id, params) {
    return dispatch => basicAction({
        type: 'post',
        data: params,
        dispatch: dispatch,
        actionType: 'ADD_MEMBER',
        url: ApiTable.addMember.replace('{postId}', id),
        msg: {
            option: '新增成员'
        },
    });
}

export function deleteMember(id,) {
    return dispatch => basicAction({
        type: 'del',
        dispatch: dispatch,
        actionType: 'DELETE_MEMBER',
        url: ApiTable.deleteMember.replace('{memberId}', id),
        msg: {
            option: '删除成员'
        },
    });
}

export function deleteMembers(params) {
    return dispatch => basicAction({
        type: 'post',
        data: params,
        dispatch: dispatch,
        actionType: 'DELETE_MEMBER_BULK',
        url: ApiTable.deleteMembers,
        msg: {
            option: '批量删除成员'
        },
    });
}

export function modifyMembers(id, params) {
    return dispatch => basicAction({
        type: 'put',
        data: params,
        dispatch: dispatch,
        actionType: 'MODIFY_MEMBER',
        url: ApiTable.modifyMember.replace('{memberId}', id),
        msg: {
            option: '编辑成员'
        },
    });
}