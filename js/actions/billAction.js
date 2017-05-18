import actions from './actionTypes';
import {postJson, fetchJson} from '../utils/service';
import envUris from '../utils/envUris';
import handleActionError from './actionErrorHandler';

/**
 * 分页获取账单列表
 * @param pageNo
 * @param pageSize
 * @returns {Function}
 */
export function getBillList(pageNo, pageSize){
  return async (dispatch)=>{
    dispatch({
      type:actions.REQUEST_ORDER_LIST
    });
    try {
      const data = await fetchJson(envUris.getOrderList(pageNo, pageSize));
      console.log('@@@@ bill ', data);
      dispatch({
        type: actions.RESPONSE_ORDER_LIST,
        data: data
      })
    }catch (payload){
      handleActionError(dispatch, payload, actions.RESPONSE_ORDER_LIST);
    }
  }
}

/**
 * 分页获取账单详情
 * @param pageNo
 * @param pageSize
 * @returns {Function}
 */
export function getBillDetail(cost, stationName,stationAddress,time,duration,prod,orderId){
  return {
    type: actions.SET_ORDER_DETAIL,
    cost: cost,
    stationName: stationName,
    stationAddress: stationAddress,
    time: time,
    duration: duration,
    prod: prod,
    orderId: orderId
  }
}