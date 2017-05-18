/**
 * Created by syl on 16/9/21.
 */
import actions from './actionTypes';
import {NetInfo} from 'react-native';
import handleActionError from './actionErrorHandler';
export function checkNet() {
    return async (dispatch)=> {
        dispatch({
            type: actions.ISCONNECTED
        });

        try {
            const data = await NetInfo.isConnected.fetch();
            console.log('### isconnected='+data);
            dispatch({
                type: actions.ISCONNECTED,
                data:true
            });
        }catch (payload){
            console.log('### error', payload);
            handleActionError(dispatch,payload,actions.ISCONNECTED)
        }
    }

}