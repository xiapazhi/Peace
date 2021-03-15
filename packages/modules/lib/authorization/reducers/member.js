import Immutable from 'immutable';
import * as ActionTypes from '../actions/member';

const memberInitState = {
    data: [],
    isRequesting: false,
    memberData:[]
}

export function member(state = memberInitState, action) {
    const { type, payload } = action;

    switch (type) {
        //get
        case ActionTypes.GET_MEMBER:
            return Immutable.fromJS(state).merge({
                isRequesting: true
            }).toJS();
        case ActionTypes.GET_MEMBER_SUCCESS:
            return Immutable.fromJS(state).merge({
                isRequesting: false,
                data: payload.data
            }).toJS();
        case ActionTypes.GET_MEMBER_ERROR:
            return Immutable.fromJS(state).merge({
                isRequesting: false
            }).toJS();

        default:
            return state;
    }
}
