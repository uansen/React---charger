import actions from './actionTypes';
import {fetchJson} from '../utils/service';
import envUris from '../utils/envUris';
import handleActionError from './actionErrorHandler';

/**
 * 地图获取附件的充电桩位置列表
 * @param longitude
 * @param latitude
 * @param distance
 * @param status
 * @returns {Function}
 */
export function getNearestChargeStations(longitude, latitude, distance, status) {
  return async (dispatch) => {
    dispatch({
      type: actions.REQUEST_MAP_LIST
    });
    try{
      console.log("@@@@@ longitude:" + longitude + "latitude:" + latitude + "distance:" + distance + "status:" + status);
      const _data = await fetchJson(envUris.getMapListUrl(longitude, latitude, distance, status));
      dispatch({
        type: actions.RESPONSE_MAP_LIST,
        data: _data
      });
    }catch(payload){
      handleActionError(dispatch, payload, actions.RESPONSE_MAP_LIST);
    }
  }
}

/**
 * 列表分页获取一定范围内的充电站
 * @param longitude
 * @param latitude
 * @param distance
 * @param status
 * @param pageNo
 * @param pageSize
 * @returns {Function}
 */
export function getListStations(longitude, latitude, distance, status, pageNo, pageSize) {
  return async (dispatch) => {
    dispatch({
      type: actions.REQUEST_STATION_LIST
    });
    try{
      const _data = await fetchJson(envUris.getListUrl(longitude, latitude, distance, status, pageNo, pageSize));
      console.log('@@@@ stations ', _data);
      dispatch({
        type: actions.RESPONSE_STATION_LIST,
        data: _data
      });
    }catch(payload){
      handleActionError(dispatch, payload, actions.RESPONSE_STATION_LIST);
    }
  }
}

/**
 * 获取充电站详情
 * @param stationId
 * @returns {Function}
 */
export function getStationDetail(stationId, longitude, latitude){
  return async (dispatch) => {
    dispatch({
      type: actions.REQUEST_STATION_DETAIL
    });
    try{
      const data = await fetchJson(envUris.getStationDetailUrl(stationId, longitude, latitude));

      dispatch({
        type: actions.RESPONSE_STATION_DETAIL,
        data: data
      });
    }catch(payload){
      handleActionError(dispatch, payload, actions.RESPONSE_STATION_DETAIL);
    }
  }
}

export function removeCurrentStation(){
 return {
   type: actions.REMOVE_STATION_DETAIL
 };
}
/**
 * 设置当前地图经纬度
 * @param longitude
 * @param latitude
 * @returns {{type: null, lon: *, lat: *}}
 */
export function setCurrentPosition(latitude,longitude,latitudeDelta,longitudeDelta,name,id){
  return {
    type: actions.SET_CURRENT_POSITION,
    lon: longitude,
    lat: latitude,
    latitudeDelta: latitudeDelta,
    longitudeDelta: longitudeDelta,
    name:name,
    id:id
  };
}

export function removeChargeNotice(){
  return {
    type: actions.REMOVE_CHARGE_NOTICE
  };
}