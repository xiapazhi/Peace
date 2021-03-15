import Immutable from 'immutable';
import * as ActionTypes from '../actions/author';

const authorListInitState = {
    data: [],
    isRequesting: false,
    enterprises: [],
    roleData: [],
    structures: [],
    departmentResources: {}
}

export function author(state = authorListInitState, action) {
    const { type, payload } = action;

    switch (type) {
        //get
        case ActionTypes.GET_AUTHOR:
            return Immutable.fromJS(state).merge({
                isRequesting: true
            }).toJS();
        case ActionTypes.GET_AUTHOR_SUCCESS:
            return Immutable.fromJS(state).merge({
                isRequesting: false,
                data: payload.data
            }).toJS();
        case ActionTypes.GET_AUTHOR_ERROR:
            return Immutable.fromJS(state).merge({
                isRequesting: false
            }).toJS();

        //getenterprisesDetail
        case ActionTypes.GET_ENTERPRISERSDETAILS:
            return Immutable.fromJS(state).merge({
                isRequesting: true
            }).toJS();
        case ActionTypes.GET_ENTERPRISERSDETAILS_SUCCESS:
            return Immutable.fromJS(state).merge({
                isRequesting: false,
                enterprises: payload.enterprises
            }).toJS();
        case ActionTypes.GET_ENTERPRISERSDETAILS_ERROR:
            return Immutable.fromJS(state).merge({
                isRequesting: false
            }).toJS();

        case ActionTypes.GET_STRUCTURE_RESOURCES_RANGE:
            return Immutable.fromJS(state).merge({
                isRequesting: true
            }).toJS();
        case ActionTypes.GET_STRUCTURE_RESOURCES_RANGE_SUCCESS:
            return Immutable.fromJS(state).merge({
                isRequesting: false,
                structures: payload.structures
            }).toJS();
        case ActionTypes.GET_STRUCTURE_RESOURCES_RANGE_ERROR:
            return Immutable.fromJS(state).merge({
                isRequesting: false
            }).toJS();

        case ActionTypes.GET_DEPARTMENT_RESOURCES:
            return Immutable.fromJS(state).merge({
                isRequesting: true
            }).toJS();
        case ActionTypes.GET_DEPARTMENT_RESOURCES_SUCCESS:
            return Immutable.fromJS(state).merge({
                isRequesting: false,
                departmentResources: payload.res
            }).toJS();
        case ActionTypes.GET_DEPARTMENT_RESOURCES_ERROR:
            return Immutable.fromJS(state).merge({
                isRequesting: false
            }).toJS();

        case ActionTypes.MODIFY_DEPARTMENT_RESOURCES:
            return Immutable.fromJS(state).merge({
                isRequesting: true
            }).toJS();
        case ActionTypes.MODIFY_DEPARTMENT_RESOURCES_SUCCESS:
        case ActionTypes.MODIFY_DEPARTMENT_RESOURCES_ERROR:
            return Immutable.fromJS(state).merge({
                isRequesting: false
            }).toJS();

        case ActionTypes.GET_AUTHORLIST:
            return Immutable.fromJS(state).merge({
                isRequesting: true
            }).toJS();
        case ActionTypes.GET_AUTHORLIST_SUCCESS:
            return Immutable.fromJS(state).merge({
                isRequesting: false,
                roleData: payload.roleData
            }).toJS();
        case ActionTypes.GET_AUTHORLIST_ERROR:
            return Immutable.fromJS(state).merge({
                isRequesting: false
            }).toJS();
        default:
            return state;
    }
}
