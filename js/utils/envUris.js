function getUrlBase(){
  /*从info.plist获取*/
  const RNDeviceInfo = require('react-native').NativeModules.RNDeviceInfo;
  if (RNDeviceInfo && RNDeviceInfo.appServer){
    return RNDeviceInfo.appServer+'/charging/ws/rest/map';
  }else {
    return 'http://172.16.33.236:8090/charging/ws/rest/map';
  }
}

function getApiVersion(){
  return '';
}

export default {
  /* 地图搜索 */
  getMapListUrl: (longitude, latitude, distance, status) => `${getUrlBase()}/station/mapList${getApiVersion()}`
      + `?longitude=${longitude}&latitude=${latitude}&distance=${distance}${status !== undefined ? ('&status=' + status) : ''}`,

  /* 列表搜索 */
  getListUrl: (longitude, latitude, distance, status, pageNo, pageSize) => `${getUrlBase()}/station/list${getApiVersion()}`
     + `?longitude=${longitude}&latitude=${latitude}&distance=${distance}`
     + `${(status !== undefined && status !== null) ? ('&status=' + status) : ''}`
     + `${(pageNo !== undefined && pageNo !== null) ? ('&pageNo=' + pageNo) : ''}`
     + `${(pageSize !== undefined && pageSize !== null) ? ('&pageSize=' + pageSize) : ''}`,

  /* 充电站详情 */
  getStationDetailUrl: (id, longitude, latitude) => `${getUrlBase()}/station/detail${getApiVersion()}?id=${id}&longitude=${longitude}&latitude=${latitude}`,

  /* 获取充电桩详情 */
  getConnectorDetailUrl: (id) => `${getUrlBase()}/connector/detail${getApiVersion()}?id=${id}`,

  /* 开始充电 */
  getOpenUrl: (id) => `${getUrlBase()}/connector/open${getApiVersion()}?id=${id}`,
  /* 充电状态轮询 */
  getProgressUrl: (orderId) => `${getUrlBase()}/connector/progress${getApiVersion()}?orderId=${orderId}`,
  /* 结束充电 */
  getCloseUrl: (orderId) => `${getUrlBase()}/connector/close${getApiVersion()}?orderId=${orderId}`,
  /* 账单列表 */
  getOrderList: (pageNo, pageSize) => `${getUrlBase()}/order/list${getApiVersion()}?pageNo=${pageNo}&pageSize=${pageSize}`,
  /* 获取验证码 */
  getVerificationCodelUrl: (tphone, areaCode) => `${getUrlBase()}/user/authCode${getApiVersion()}?tphone=${tphone}&areaCode=${areaCode}`,
  /* 登陆 */
  getLoginUrl: (tphone, areaCode, authCode) => `${getUrlBase()}/user/login${getApiVersion()}?tphone=${tphone}`
                + `&areaCode=${areaCode}&authCode=${authCode}`
};
