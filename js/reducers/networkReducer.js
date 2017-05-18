/**
 * Created by syl on 16/9/21.
 */
import actions from '../actions/actionTypes';
import createReducer from '../createReducer';
import Immutable from 'immutable';



const initialState = {
    isConnected:null
}
const reducer = createReducer(Immutable.fromJS(initialState),{
    [actions.ISCONNECTED]:(state, action)=> state.merge({
        isConnected: action.data
    })
},'isConnected');

export default reducer;