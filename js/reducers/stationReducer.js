import createReducer from '../createReducer';
import Immutable from 'immutable';
import actions from '../actions/actionTypes';

const initialState = {
  isFetching: false,
  isFetchingDetail: false,
  currentStationList: [],
  currentPosition: null,
  currentStationDetail: null, // 当前选中查看详情的充电站
  isFromCamera: false,
  isShowChargeNotice: true,
  error: null,
  stationListCount: 0,
  isComplete: false
};

const reducer = createReducer(Immutable.fromJS(initialState), {
  [actions.REQUEST_MAP_LIST]: state => state.merge({
    isFetching: true,
    isComplete: false
  }),
  [actions.RESPONSE_MAP_LIST]: (state, action) => state.merge({
    isFetching: false,
    currentStationList: action.data,
    isFromCamera:false,
    isComplete: true
  }),
  [actions.REQUEST_STATION_LIST]: state => state.merge({
    isFetching: true,
    isComplete: false
  }),
  [actions.RESPONSE_STATION_LIST]: (state, action) => {
    return state.merge({
      isFetching: false,
      isComplete: true,
      currentStationList: action.data.list,
      stationListCount: action.data.count ? (action.data.count / action.data.pageSize + 0.5).toFixed(0) : 0
    });
  },
  [actions.REQUEST_STATION_DETAIL]: state => state.merge({
    isFetchingDetail: true
  }),
  [actions.RESPONSE_STATION_DETAIL]: (state, action) => state.merge({
    isFetchingDetail: false,
    isComplete: true,
    currentStationDetail: action.data
  }),
  [actions.REMOVE_STATION_DETAIL] : state => state.merge({
    currentStationDetail: null
  }),
  [actions.SET_CURRENT_POSITION]: (state, action) => {
    if(action.lon === 0 && action.lat === 0 ){
      return state.merge({
        currentPosition: null
      });
    }else{
      return state.merge({
        currentPosition: {
          lng: action.lon,
          lat: action.lat,
          latitudeDelta: action.latitudeDelta,
          longitudeDelta: action.longitudeDelta,
          name: action.name,
          chargerId: action.id
        }
      });
    }
  },
  [actions.REMOVE_CHARGE_NOTICE] : state => state.merge({
    isShowChargeNotice: false
  }),
  [actions.SHOW_ERROR]: (state, action) => state.merge({
    isFetching: false,
    isComplete: false,
    isFetchingDetail: false,
    error: action.payload
  }),
  [actions.HIDE_ERROR]: state => state.merge({
    error: null
  })
}, 'station');
export default reducer;