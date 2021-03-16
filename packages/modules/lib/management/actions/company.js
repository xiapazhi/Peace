import { ApiTable } from '$utils';
import { basicAction } from '@peace/utils'

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

export function editCompanyList(id, params) {
    return dispatch => basicAction({
        type: 'put',
        data: params,
        dispatch: dispatch,
        actionType: 'EDIT_COMPANY',
        url: ApiTable.modifyEnterprise.replace('{enterpriseId}', id),
        msg: {
            option: '修改企业信息'
        },
    });
}

export default {
    getEnterprisesDetails,
}