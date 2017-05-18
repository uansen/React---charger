import actions from './actionTypes';
import i18n from '../utils/i18n';

/**
 * 在errorTip中显示错误
 * @param  {Function} dispatch
 * @param  {String} error    消息体
 * @param  {String} source   错误来源
 * @return {JSON Object}     状态数据
 */
export default function handleActionError(dispatch, error, source) {
  const errorJson = {
    msg: ""
  };

  if(error){
    if( typeof error === 'string'){
      errorJson.msg = error;
    }else if(error.timeout){
      errorJson.msg = i18n.ERROR_REQUEST_TIMEOUT;
    }else if(error instanceof Error){
      if(error.response && error.response.text){
        errorJson.msg = error.response.text;
      }
    }else if(error.message){
      errorJson.msg = error.message;
    }

    return dispatch({
      type: actions.SHOW_ERROR,
      source: source,
      payload: errorJson
    });
  }
}