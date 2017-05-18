import actions from './actionTypes';
import {NetInfo} from 'react-native';

/**
 * 统一消除error
 * @returns {{type: null}}
 */
export function hideError(){
  return {
    type: actions.HIDE_ERROR
  };
}

