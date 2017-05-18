/**
 * Created by syl on 16/8/31.
 */
import createReducer from '../createReducer';
import Immutable from 'immutable';
import actions from '../actions/actionTypes';

const initialState = {
    isFetching: false,
    isComplete: false,
    billLists: [],
    orderDetail: null,
    billListCount: 0
}

const reducer = createReducer(Immutable.fromJS(initialState), {
    [actions.REQUEST_ORDER_LIST]: state => state.merge({
        isFetching: true,
        isComplete: false
    }),
    [actions.RESPONSE_ORDER_LIST]: (state, action) => state.merge({
        isFetching: false,
        isComplete: true,
        billLists: action.data.list,
        billListCount: action.data.count ? (action.data.count / action.data.pageSize + 0.5).toFixed(0) : 0
    }),
    [actions.SET_ORDER_DETAIL]: (state, action) => state.merge({
        isComplete: true,
        orderDetail: {
            cost: action.cost,
            stationName: action.stationName,
            stationAddress: action.stationAddress,
            time: action.time,
            duration: action.duration,
            prod: action.prod,
            orderId: action.orderId
        }
    }),
    [actions.SHOW_ERROR]: (state, action) => state.merge({
        isFetching: false,
        isComplete: false,
        payload: action.payload.msg
    })
}, 'bill');

export default reducer;