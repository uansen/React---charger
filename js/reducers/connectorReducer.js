import createReducer from '../createReducer';
import Immutable from 'immutable';
import actions from '../actions/actionTypes';

const initialState = {
  isFetching: false,
  connectorSpec: null, //充电枪详情
  isOpen: false,  // 用于判断是否在充电中,
  chargingStatus: null, // 轮询充电状态
  orderId: null,
  orderBeginTime: null, // 开始充电的时间
  checkoutInfo: null, // 充电结束后,返回的订单详情信息,
  error: null
};

const reducer = createReducer(Immutable.fromJS(initialState), {
  /* 获取充电枪详情 */
  [actions.REQUEST_CONNECTOR_DETAIL]: state => state.merge({
    isFetching: true
  }),
  [actions.RESPONSE_CONNECTOR_DETAIL]: (state, action) => state.merge({
    isFetching: false,
    connectorSpec: action.data
  }),
  /* 清除当前充电枪 */
  [actions.REMOVE_CONNECTOR_DETAIL]: state => state.merge({
    connectorSpec: null,
    chargingStatus:null,
    orderId:null,
    orderBeginTime:null,
    isOpen:false,
    isFetching:false,
    checkoutInfo:null
  }),
  /* 开启充电枪 */
  [actions.REQUEST_OPEN_CONNECTOR]: state => state.merge({
    isFetching: true
  }),
  [actions.RESPONSE_OPEN_CONNECTOR]:(state, action) => state.merge({
    isFetching: false,
    isOpen: true,
    orderId: action.data.orderId,
    orderBeginTime: action.data.beginTime
  }),
  /* 轮询充电状态 */
  [actions.REQUEST_CONNECTOR_PROGRESS]: state => state.merge({
    isFetching: true
  }),
  [actions.RESPONSE_CONNECTOR_PROGRESS]:(state, action) => state.merge({
    isFetching: false,
    isOpen: true,
    chargingStatus: action.data
  }),
  /* 结束充电 */
  [actions.REQUEST_CLOSE_CONNECTOR]:state => state.merge({
    isFetching: true
  }),
  [actions.RESPONSE_CLOSE_CONNECTOR]:(state, action) => state.merge({
    isFetching: false,
    isOpen: false,
    checkoutInfo: action.data
  }),
  [actions.SHOW_ERROR]: (state, action) => state.merge({
    isFetching: false,
    error: action.payload
  }),
  [actions.HIDE_ERROR]: state => state.merge({
    error: null
  })
}, 'connector');

export default reducer;