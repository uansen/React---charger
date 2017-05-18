const rootReducer = {};
function combine(reducer){
  if(reducer.reducerName) {
    rootReducer[reducer.reducerName] = reducer;
  }
}

import loginReducer from './loginReducer';
import stationReducer from './stationReducer';
import connectorReducer from './connectorReducer';
import billReducer from './billReducer';
import networkReducer from './networkReducer'

combine(loginReducer);
combine(stationReducer);
combine(connectorReducer);
combine(billReducer);
combine(networkReducer);

export default rootReducer;
