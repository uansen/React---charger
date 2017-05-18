import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';
import { combineReducers } from 'redux-immutablejs';
import Immutable from 'immutable';

import * as reducers from './reducers';

const loggerMiddleware = createLogger({
  stateTransformer: (state) => state.toJSON()
});

const reducer = combineReducers(reducers.default);

const createStoreWithMiddleware = applyMiddleware(thunkMiddleware, loggerMiddleware)(createStore);

function createAppStore(){
  const state = Immutable.fromJS({});
  const store = reducer(state);
  return createStoreWithMiddleware(reducer, store);
}

const sharedStore = createAppStore();

export default sharedStore;
