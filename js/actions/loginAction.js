import actions from './actionTypes';
import {fetchJson, setCurrentUserId} from '../utils/service';
import envUris from '../utils/envUris';
import handleActionError from './actionErrorHandler';

//获取验证码
export function getVerificationCode(tphone,areaCode) {
  return async (dispatch)=>{
    dispatch({
      type:actions.REQUEST_VERIFICATION_CODE
    });

    try {
      const data = await fetchJson(envUris.getVerificationCodelUrl(tphone,areaCode));
      console.log('codeData_action : '+ data.authCode);
      dispatch({
        type: actions.RESPONSE_VERIFICATION_CODE,
        data: data
      })
    }catch (payload){
      handleActionError(dispatch,"SEND_CODE_ERROR",actions.REQUEST_VERIFICATION_CODE);
    }
  }

}

//登陆
export function login(tphone,areaCode,authCode) {
  return async (dispatch)=>{
    dispatch({
      type:actions.REQUEST_LOGIN
    })
    try {
      const data = await fetchJson(envUris.getLoginUrl(tphone,areaCode,authCode));
      console.log('loginData : '+ data.userId);
      setCurrentUserId(data.userId);
      dispatch({
        type:actions.RESPONSE_LOGIN,
        data:data
      });
    }catch (payload){
      handleActionError(dispatch,"LOGIN_ERROR",actions.RESPONSE_LOGIN);
    }

  }
}

//登出
export function logout() {
  return (dispatch) => {
    dispatch({
      type: actions.REQUEST_LOGOUT
    });

    try {
      // 删除单个数据
      storage.remove({key: 'autoUser'});

      dispatch({
        type: actions.RESPONSE_LOGOUT
      })
    } catch (payload) {
      handleActionError(dispatch, "RESPONSE_LOGOUT_ERROR", actions.RESPONSE_LOGIN);
    }

  }
}

/**
 * 从storage初始化user
 */
export function initUser(user){
  return {
    type: actions.SET_LOGIN_USER,
    user: user
  }
}

export function changeOrderStatusOn() {
  return {
    type: actions.CHANGE_ORDERSTATUS_ON
  }

}
export function changeOrderStatusOff() {
  return {
    type: actions.CHANGE_ORDERSTATUS_OFF
  }

}