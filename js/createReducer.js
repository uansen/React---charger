import * as reducer from 'redux-immutablejs';
import Immutable from 'immutable';
import actions from './actions/actionTypes';

export default function createReducer(initialState, handlers, reducerName) {
  const extraHandlers = {
    [actions.REQUEST_CLEAN_STORE]: state => state.merge(
      initialState.toJSON()
    ),
    [actions.REQUEST_SET_VIA_PATH_ + reducerName]: (state, action) => {
      if (action.path.length > 0) {
        return state.setIn(action.path, Immutable.fromJS(action.data));
      }
      return state.merge(action.data);
    }
  };

  // 统一的错误处理,消除isFetching
  if (!handlers[actions.SHOW_ERROR]) {
    extraHandlers[actions.SHOW_ERROR] = (state) => {
      if (state.get('isFetching')) {
        return state.merge({
          isFetching: false
        });
      }
      return state;
    };
  }
  const returnReducer = reducer.createReducer(initialState, {...handlers, ...extraHandlers});
  returnReducer.reducerName = reducerName;
  return returnReducer;
}
