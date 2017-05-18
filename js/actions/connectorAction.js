import actions from './actionTypes';
import {postJson, fetchJson} from '../utils/service';
import envUris from '../utils/envUris';
import handleActionError from './actionErrorHandler';

/**
 * 获取充电枪详情
 * @param connectorId 充电桩Id
 * @returns {Function}
 */
export function getConnectorDetail(connectorId) {
  return async (dispatch)=> {
    dispatch({
      type:actions.REQUEST_CONNECTOR_DETAIL
    });
    try {
      const _data = await fetchJson(envUris.getConnectorDetailUrl(connectorId));
      console.log('@@@ data', _data);
      dispatch({
        type:actions.RESPONSE_CONNECTOR_DETAIL,
        data: _data
      });

    }catch (payload){
      console.log('@@@ error', payload);
      handleActionError(dispatch, payload.error, actions.RESPONSE_CONNECTOR_DETAIL);
    }
  }
}

/**
 * 没有开始充电的情况下, 清除当前所连接的充电枪数据
 * @returns {{type: null}}
 */
export function clearConnectorDetail(){
  return {
    type: actions.REMOVE_CONNECTOR_DETAIL
  };
}

/**
 * 开启充电枪
 * @param chargerId
 * @param userId
 */
export function openConnector(id){
  return async (dispatch) => {
    dispatch({
      type:actions.REQUEST_OPEN_CONNECTOR
    });
    try {
      // const postBody = {
      //   "id": chargerId
      // };
      //
      // if(strategy){
      //   postBody.strategy = strategy;
      // }
      // if(moneyLimit){
      //   postBody.moneyLimit = moneyLimit;
      // }
      const _data = await postJson(envUris.getOpenUrl(id), null);
      dispatch({
        type: actions.RESPONSE_OPEN_CONNECTOR,
        data: _data
      });
    }catch (payload){
      handleActionError(dispatch,payload,actions.RESPONSE_OPEN_CONNECTOR);
    }
  }
}
/**
 * 获取充电状态
 * @param orderId
 * @returns {Function}
 */
export function getConnectionStatus(orderId){
  return async (dispatch)=>{
    dispatch({
      type:actions.REQUEST_CONNECTOR_PROGRESS
    });
    try {
      const _data = await fetchJson(envUris.getProgressUrl(orderId));

      dispatch({
        type: actions.RESPONSE_CONNECTOR_PROGRESS,
        data: _data
      });
    }catch (payload){
      handleActionError(dispatch, payload, actions.RESPONSE_CONNECTOR_PROGRESS);
    }
  }
}

/**
 * 关闭充电枪
 * @param orderId
 * @returns {Function}
 */
export function closeConnector(orderId){
  return async (dispatch)=>{
    dispatch({
      type: actions.REQUEST_CLOSE_CONNECTOR
    });
    try {
      const _data = await postJson(envUris.getCloseUrl(orderId),null);
      dispatch({
        type: actions.RESPONSE_CLOSE_CONNECTOR,
        data: _data
      })
    }catch (payload){
      handleActionError(dispatch,payload,actions.RESPONSE_CLOSE_CONNECTOR);
    }
  }
}


