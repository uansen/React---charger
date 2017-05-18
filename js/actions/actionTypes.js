import keyMirror from 'keymirror';

export default keyMirror({
  REQUEST_CLEAN_STORE: null,
  REQUEST_SET_VIA_PATH_: null,
  SHOW_ERROR: null,
  HIDE_ERROR: null,

  /* 根据地图获取场站列表 */
  REQUEST_MAP_LIST: null,
  RESPONSE_MAP_LIST: null,

  /* 列表展示附近场站列表 */
  REQUEST_STATION_LIST: null,
  RESPONSE_STATION_LIST: null,

  /* 设置当前经纬度 */
  SET_CURRENT_POSITION: null,

  /* 场站详情 */
  REQUEST_STATION_DETAIL: null,
  RESPONSE_STATION_DETAIL: null,
  REMOVE_STATION_DETAIL: null,
  REMOVE_CHARGE_NOTICE: null,

  /* 充电枪详情 */
  REQUEST_CONNECTOR_DETAIL:null,
  RESPONSE_CONNECTOR_DETAIL:null,
  REMOVE_CONNECTOR_DETAIL: null,

  /* 开始充电 */
  REQUEST_OPEN_CONNECTOR:null,
  RESPONSE_OPEN_CONNECTOR:null,

  /* 充电状态轮询 */
  REQUEST_CONNECTOR_PROGRESS:null,
  RESPONSE_CONNECTOR_PROGRESS:null,

  /* 结束充电 */
  REQUEST_CLOSE_CONNECTOR:null,
  RESPONSE_CLOSE_CONNECTOR:null,

  /* 订单列表 */
  REQUEST_ORDER_LIST:null,
  RESPONSE_ORDER_LIST:null,

  /* 订单详情 */
  REQUEST_ORDER_DETAIL:null,
  RESPONSE_ORDER_DETAIL:null,
  SET_ORDER_DETAIL: null,
  /* 获取验证码 */
  REQUEST_VERIFICATION_CODE: null,
  RESPONSE_VERIFICATION_CODE: null,

  /* 登录 */
  REQUEST_LOGIN: null,
  RESPONSE_LOGIN: null,
  REQUEST_LOGOUT: null,
  RESPONSE_LOGOUT: null,
  SET_LOGIN_USER: null,

  /*网络监听*/
  ISCONNECTED: null,

  /*修改orderStatus*/
  CHANGE_ORDERSTATUS_ON:null,
  CHANGE_ORDERSTATUS_OFF:null


});
