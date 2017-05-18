import createReducer from '../createReducer';
import Immutable from 'immutable';
import actions from '../actions/actionTypes';

const initialState = {
  isFetching: false,
  isLoggedin: false,
  authCode: null,
  user: [],
  orderStatus:null
};

const reducer = createReducer(Immutable.fromJS(initialState), {
  [actions.REQUEST_VERIFICATION_CODE]: state => state.merge({
    isFetching: true,
    isLoggedin: false
  }),
  [actions.RESPONSE_VERIFICATION_CODE]: (state, action) => state.merge({
    authCode: action.data.authCode
  }),
  [actions.REQUEST_LOGIN]: state => state.merge({
    isFetching: true,
    isLoggedin: false
  }),
  [actions.RESPONSE_LOGIN]: (state, action) => state.merge({
    isFetching: false,
    isLoggedin: true,
    user: action.data,
    orderStatus:action.data.orderStatus
  }),
  [actions.REQUEST_LOGOUT]: state => state.merge({
    isLoggedin: true
  }),
  [actions.RESPONSE_LOGOUT]: state => state.merge(initialState),
  [actions.SHOW_ERROR]: (state, action) => state.merge({
    isFetching: false,
    payload: action.payload.msg
  }),
  [actions.SET_LOGIN_USER]: (state, action) => state.merge({
    isFetching: false,
    isLoggedin: true,
    user: action.user
  }),
  [actions.CHANGE_ORDERSTATUS_ON]:(state)=>state.merge({
    orderStatus:1
  }),
  [actions.CHANGE_ORDERSTATUS_OFF]:state=>state.merge({
    orderStatus:0
  })
}, 'login');
export default reducer;