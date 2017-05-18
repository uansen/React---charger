/**
 * Created by syl on 16/8/16.
 */
import React, {Component, PropTypes} from 'react';
import {Image,StyleSheet, Text, View, ListView, TouchableOpacity, TouchableHighlight, Dimensions,ActivityIndicator,Animated,Easing} from 'react-native';
import { connect } from 'react-redux';
import MapNavigationBar from '../home/MapNavigationBar';
import Icon from 'react-native-vector-icons/Ionicons';
import Button from 'apsl-react-native-button';
import {Actions} from 'react-native-router-flux';
import {getListStations} from '../../actions/stationAction';
import baiduMapApi from '../../utils/baiduMapApi';
import SeparateLine from "../../components/SeparateLine";
import PullToRefreshListView from 'react-native-smart-pull-to-refresh-listview';
import NoBillView from '../../components/NoBillView';
import BillNetErrorView from '../../components/BillNetErrorView';
import TimerEnhance from 'react-native-smart-timer-enhance';
import StationFilter from '../home/StationFilter';
import ChargerIcon from '../../utils/chargerIcons';
import ChargerIcons from '../../utils/chargerIconstwo';
import Drawer from 'react-native-drawer';
import DrawerContent from '../home/DrawerContent';
import MapLinking from 'react-native-map-linking';
import i18n from '../../utils/i18n';
import { setCurrentPosition} from '../../actions/stationAction';


const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const PAGE_SIZE = 7;

class SearchListContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
            latitude: 31.22,
            longitude: 121.48,
            latitudeDelta: 0.3,
            longitudeDelta: 0.3,
            pageNo: 1,
            stationList: [],
            isNoStationList: false,
            isNetError: false,
            isNoMoreData: false,
            rotateValue: new Animated.Value(0),
            isShowView: false,
            isShowFilter: true,
            filterY: new Animated.Value(0),
            filterScale: new Animated.Value(1),
            filterOpacity: new Animated.Value(0),
            stationStatus: 1,
            bounceValue: new Animated.Value(1),
            isOpen: false,
            isShowNearby: false,
            isShowClosest: false,
            tabOne: i18n.NEARBY,
            tabTwo: i18n.THE_CLOSEST

        };
    }

    //请求网络数据
    componentDidMount() {
        this._onChangeStatus();
        setTimeout(()=>{
            this._pullToRefreshListView.beginRefresh();
        },1000);

    }

    componentWillReceiveProps(nextProps){

        const prvIsFetching = this.props.isFetching;
        const nextIsFetching = nextProps.isFetching;
        const prvIsComplete = this.props.isComplete;
        const nextIsComplete = nextProps.isComplete;

        const stationListCount = nextProps.stationListCount;
        const currentPageNo = this.state.pageNo + 1;

        //结束刷新
        if(this._pullToRefreshListView) {
            this.state.pageNo < 1 ? this._pullToRefreshListView.endRefresh() : this._pullToRefreshListView.endLoadMore(this.state.isNoMoreData);
        }

        if (prvIsFetching && !nextIsFetching && !prvIsComplete && nextIsComplete && stationListCount >= currentPageNo){

            this.state.pageNo += 1;
            this.setState(this.state);

            if (nextProps.currentStationList.length > 0){

                let stationList = nextProps.currentStationList
                if (this.state.pageNo > 1){
                    stationList = this.state.stationList.concat(stationList);
                }

                this.setState({
                    isNoMoreData: (stationListCount == currentPageNo),
                    isNetError: false,
                    isNoStationList: false,
                    stationList: stationList,
                    dataSource:this.state.dataSource.cloneWithRows(stationList)

                });

            }else {
                this.setState({
                    isNoStationList: true,
                    isNetError: false
                });
            }
        }else if(!nextIsFetching && !nextIsComplete){

            this.setState({
                isNetError: true,
                isNoStationList: false
            });
        }

    }
    _setCurrentPosition(){
        navigator.geolocation.getCurrentPosition(position => {
            if(position && position.coords){
                this.setState({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                });
            }
        }, error => {

        }, {
            enableHighAccuracy: true,
            timeout: 20000,
            maximumAge: 1000
        });

        this.props.dispatch(getListStations(121, 31, 300000,this.state.stationStatus,1,PAGE_SIZE));
    }

    render() {
        return (
          <Drawer ref={ref => this._drawer = ref}
                  content={
                      this.state.isOpen &&
                      <DrawerContent drawer={this._drawer} onMenuClicked={this._onDrawerMenuItemClick.bind(this)}
                                     isOpen={this.state.isOpen}/>}
                  tapToClose
                  onCloseStart={this._closeCallback.bind(this)}
                  openDrawerOffset={0.38}
                  panCloseMask={0.2}
                  closedDrawerOffset={-3}
                  styles={drawerStyles} >
              <Animated.View style={[styles.container,
                  {transform: [{
                      rotateY: this.state.rotateValue.interpolate({
                          inputRange: [0,1],
                          outputRange: ['0deg','90deg']
                      })},{scale: this.state.bounceValue}]
                  }]} >

                  <MapNavigationBar onMenuClicked={this._toggleMenu.bind(this)} disabled
                                    onTextAreaClicked={() => Actions.searchhistory()}
                                    onSwitchClicked={this._onMapView.bind(this)}
                                    onFilterClicked={this._isShowFilter.bind(this)}
                                    iconName = 'icon_iconfont-20'/>
                  {this.renderContent()}
                  {!this.state.isShowFilter ? this._renderFilter() : null}

              </Animated.View>
              {this.state.isShowNearby && this._renderNearbySelectView()}
              {this.state.isShowClosest && this._renderClosestSelectView()}
          </Drawer>
        )
    }

    renderTab(){
        return(
          <View style={styles.titleTab}>
              <TouchableOpacity style={[styles.leftTab,this.state.isShowNearby && {backgroundColor: 'rgb(254,254,254)'}]} onPress={this._onNearbyClick.bind(this)} >
                  <Text style={[styles.tabText,this.state.isShowNearby && {color: 'rgb(115,143,254)'}]}>{this.state.tabOne}</Text>
                  <ChargerIcons style={styles.icon} name="icon_icon25" size={10}  color={this.state.isShowNearby ? 'rgb(115,143,254)' : 'rgb(255,255,255)'}/>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.leftTab,this.state.isShowClosest && {backgroundColor: 'rgb(254,254,254)'}]} onPress={this._onClosestClick.bind(this)}>
                  <Text style={[styles.tabText,this.state.isShowClosest && {color: 'rgb(115,143,254)'}]}>{this.state.tabTwo}</Text>
                  <ChargerIcons style={styles.icon} name="icon_icon25" size={10}  color={this.state.isShowClosest ? 'rgb(115,143,254)' : 'rgb(255,255,255)'}/>
              </TouchableOpacity>
          </View>
        );
    }

    _renderNearbySelectView(){
        return(
          <TouchableOpacity style={styles.selectView} onPress={this._onHideSelect.bind(this)}>
              {
                  nearbyData.map((data,index)=>
                    <TouchableOpacity key={index} style={styles.selectContent} onPress={this._tabOneRowPress.bind(this,data)}>
                        <View style={styles.selectRowView}>
                            <Text style={[styles.selectText, this.state.tabOne === data.text && {color: 'rgb(115,143,254)' }]   }>{data.text}</Text>
                        </View>
                    </TouchableOpacity>
                  )
              }
          </TouchableOpacity>
        );
    }

    _renderClosestSelectView(){
        return(
          <TouchableOpacity style={styles.selectView} onPress={this._onHideSelect.bind(this)}>
              {
                  closestData.map((data,index)=>
                    <TouchableOpacity key={index} style={styles.selectContent} onPress={this._tabTwoRowPress.bind(this,data)}>
                        <View style={styles.selectRowView}>
                            <Text style={[styles.selectText, this.state.tabTwo === data.text && {color: 'rgb(115,143,254)' }]   }>{data.text}</Text>
                        </View>
                    </TouchableOpacity>
                  )
              }
          </TouchableOpacity>
        );
    }

    //进行渲染数据
    renderContent() {
        return this.state.isNoStationList || this.state.isNetError ? this._renderTipsView() : this._renderListView();
    }

    _renderListView(){
        return (
          <View style={styles.context}>
              {this.renderTab()}
              <PullToRefreshListView
                ref={ (component) => this._pullToRefreshListView = component }
                viewType={PullToRefreshListView.constants.viewType.listView}
                enableEmptySections={true}
                dataSource={this.state.dataSource}
                renderRow={this.renderItem.bind(this)}
                renderHeader={this._renderHeader.bind(this)}
                renderFooter={this._renderFooter.bind(this)}
                onRefresh={this._onRefresh.bind(this)}
                onLoadMore={this._onLoadMore.bind(this)}
                pullUpDistance={40}
                pullUpStayDistance={40}
                pullDownDistance={40}
                pullDownStayDistance={40}
              />
          </View>

        );
    }

    //渲染每一条的数据
    renderItem(data) {
        return (
          <TouchableOpacity style={styles.row} onPress={this._rowPress.bind(this,data)}>
              <View style={styles.upview}>
                  <View style={styles.leftview}>
                      <View style={styles.leftUpView}>
                          <Image style={styles.image} source={require("../../assets/images/location@2x.png")}></Image>
                          <Text style={styles.left_text_up}>{data.name ? data.name : null}</Text>
                          <Text style={styles.right_text_up}>{(data.distance ? ((data.distance/1000).toFixed(1)) : null)+ 'km'}</Text>
                      </View>
                      <View style={styles.left_View_down}>
                          {data.fast ? this._renderFastView(data) : null}
                          {data.normal ? this._renderNormalView(data) : null}
                          {!data.fast && !data.normal ? this._renderNoChargerView() : null}
                      </View>
                  </View>
              </View>
          </TouchableOpacity>

        )
    }

    _rowPress(data){
        const position = data.latitude;
        if (position) {
            this.props.dispatch(setCurrentPosition(data.latitude, data.longitude,this.props.currentPosition.latitudeDelta,this.props.currentPosition.longitudeDelta,data.name,data.id));
            // Actions.main({
            //     refresh: {
            //         currentPosition: position
            //     }
            // });
            this.props.onSwitch();
        }else{
            this.props.onSwitch();
        }
    }

    _renderFastView(data){
        return(
          <View style={styles.textView}>
              <View style={styles.roundView}/>
              <Text style={styles.left_text_down}>{i18n.FAST}</Text>
              <Text style={styles.fastFee}>{'HK$' + 1.8 + '/min'}</Text>
              <Text style={styles.fastLineUp}>{9 + ' ' + i18n.PEOPLE_IN_FRONT}</Text>
          </View>
        );
    }

    _renderNormalView(data){
        return(
          <View style={styles.textView}>
              <View style={styles.roundView}/>
              <Text style={styles.left_text_down}>{i18n.NORMAL}</Text>
              <Text style={styles.fastFee}>{'HK$' + 1.8 + '/min'}</Text>
              <Text style={styles.fastLineUp}>{3 + ' ' + i18n.AVAILABLE}</Text>
          </View>
        );
    }
    _renderNoChargerView(){
        return(
          <View style={styles.textView}>
              <Text style={styles.noChargerText}>{i18n.NO_CHARGER}</Text>
          </View>
        );
    }

    _renderTipsView(){
        if (this.state.isNetError){
            return(
              <TouchableOpacity style={styles.errorView} onPress={()=>this._onRefresh()} >
                  <View >
                      <BillNetErrorView></BillNetErrorView>
                  </View>

              </TouchableOpacity>
            )

        }else {
            return(
              <TouchableOpacity style={styles.errorView} onPress={()=>this._onRefresh()} >
                  <View >
                      <NoBillView></NoBillView>
                  </View>

              </TouchableOpacity>

            )
        }


    }

    //刷新数据
    _renderHeader = (viewState) => {
        let {pullState, pullDistancePercent} = viewState
        let {refresh_none, refresh_idle, will_refresh, refreshing} = PullToRefreshListView.constants.viewState
        pullDistancePercent = Math.round(pullDistancePercent * 100)
        switch(pullState) {
            case refresh_idle:
                return (
                  <View style={{height: 40, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgb(250,250,250)',}}>
                      <Text>pull down to refresh {pullDistancePercent}%</Text>
                  </View>
                )
            case will_refresh:
                return (
                  <View style={{height: 40, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgb(250,250,250)',}}>
                      <Text>release to refresh {pullDistancePercent > 100 ? 100 : pullDistancePercent}%</Text>
                  </View>
                )
            case refreshing:
                return (
                  <View style={{flexDirection: 'row', height: 40, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgb(250,250,250)',}}>
                      {this._renderActivityIndicator()}<Text>refreshing</Text>
                  </View>
                )
        }
    }

    //加载更多
    _renderFooter = (viewState) => {
        let {pullState, pullDistancePercent} = viewState
        let {load_more_none, load_more_idle, will_load_more, loading_more, loaded_all, } = PullToRefreshListView.constants.viewState
        pullDistancePercent = Math.round(pullDistancePercent * 100);
        switch(pullState) {
            case load_more_none:
                return (
                  <View style={{height: 40, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgb(250,250,250)',}}>
                      <Text>pull up to load more</Text>
                  </View>
                )
            case load_more_idle:
                return (
                  <View style={{height: 40, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgb(250,250,250)',}}>
                      <Text>pull up to load more {pullDistancePercent}%</Text>
                  </View>
                )
            case will_load_more:
                return (
                  <View style={{height: 40, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgb(250,250,250)',}}>
                      <Text>release to load more {pullDistancePercent > 100 ? 100 : pullDistancePercent}%</Text>
                  </View>
                )
            case loading_more:

            case loaded_all:
                return (
                  <View style={{height: 40, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgb(250,250,250)',}}>
                      <Text>no more</Text>
                  </View>
                )
        }
    }


    //正在刷新数据
    _onRefresh = () => {
        this.setState({
            pageNo : 0
        });
        this._setCurrentPosition();
    }

    //正在加载数据
    _onLoadMore = () => {
        this.props.dispatch(getListStations(121, 31, 300000,this.state.stationStatus,this.state.pageNo + 1,PAGE_SIZE));
    }

    _renderActivityIndicator() {
        return ActivityIndicator ? (
          <ActivityIndicator
            style={{marginRight: 10}}
            animating={true}
            color={'black'}
            size={'small'}/>
        ) : Platform.OS === 'android' ?
          (
            <ProgressBarAndroid
              style={{marginRight: 10}}
              color={'black'}
              styleAttr={'Small'}/>

          ) :  (
          <ActivityIndicatorIOS
            style={{marginRight: 10}}
            animating={true}
            color={'black'}
            size={'small'}/>
        )
    }

    _renderFilter(){
        return (
          <Animated.View style={[styles.popChargeNotice,{opacity: this.state.filterOpacity}, {transform: [{translateY: this.state.filterY}, {scale: this.state.filterScale}]}]}>
              <TouchableOpacity onPress={()=> this._isHideFilter()} >
                  <View>
                      <StationFilter onChangeStatus={this._onChangeStatus.bind(this)}/>
                  </View>

              </TouchableOpacity>
          </Animated.View>
        );
    }
    _isShowFilter(){
        if (!this.state.isShowFilter) {
            this._isHideFilter();

        }else {
            this.state.filterY.setValue(0);
            this.state.filterScale.setValue(1);
            Animated.sequence([
                Animated.timing(this.state.filterOpacity, {
                    toValue: 1,
                    duration: 500,
                    easing: Easing.linear
                }),
                Animated.spring(this.state.filterY, {
                    toValue: 0
                })
            ]).start();
            this.setState({isShowFilter: false});
        }
    }
    _isHideFilter() {
        Animated.sequence([
            Animated.timing(this.state.filterOpacity, {
                toValue: 0,
                duration: 200,
                easing: Easing.linear
            })
        ]).start(() => {
            this.setState({ isShowFilter: true});
        });
    }

    _onChangeStatus(){
        // 读取
        storage.load({
            key: 'autoUser',
            autoSync: true,
            syncInBackground: true
        }).then(ret => {
            if (ret.mobile) {
                storage.load({
                    key: ret.mobile,
                    id: 'station',
                    autoSync: true,
                    syncInBackground: true
                }).then(ret => {
                    if (ret.stationStatus) {
                        this.state.stationStatus = 1;
                    } else {
                        this.state.stationStatus = 0;
                    }
                    this.setState(this.state);
                }).catch(err => {
                    console.log(err.message);
                });
            }
        }).catch(err => {});

    }
    _searchAction(text){


    }

    _onDrawerMenuItemClick(menuKey) {
        switch (menuKey) {
            case 'billList':
                Actions.billList();
                break;
            case 'balance':
                Actions.balance();
                break;
            case 'settings':
                Actions.settings();
                break;
            default:
                break;
        }
    }

    _closeCallback(){
        Animated.spring(
          this.state.bounceValue,
          {
              toValue: 1.0,
              friction: 7
          }
        ).start(()=>{
            this.setState({
                isOpen: false
            });
        });
    }

    // show or hide left drawer menu
    _toggleMenu(){
        this.setState({
            isOpen: true
        });
        this._drawer.open();

        Animated.spring(
          this.state.bounceValue,
          {
              toValue: 0.8,
              friction: 7
          }
        ).start(this.setState({ isShowFilter: true}));  // 开始
    }

    _onMapView(){
        this.setState({
            isOpen: false
        });
        setTimeout(()=>{
            this.props.onSwitch();
        },400);

    }
    _onReserve(data){
        // 唤起地图, 并让地图规划从开始到结束的路线
        MapLinking.planRoute({lat:this.state.latitude, lng: this.state.longitude, title: '起点'}, {lat:data.latitude, lng: data.longitude, title: '终点'}, 'drive');

    }

    _onNearbyClick(){
        this.setState({
            isShowNearby: true,
            isShowClosest: false
        });
    }

    _onClosestClick(){
        this.setState({
            isShowNearby: false,
            isShowClosest: true
        });
    }
    _onHideSelect(){
        this.setState({
            isShowNearby: false,
            isShowClosest: false
        });
    }

    _tabOneRowPress(data){
        this.setState({
            tabOne: data.text,
            isShowNearby: false
        });
    }
    _tabTwoRowPress(data){
        this.setState({
            tabTwo: data.text,
            isShowClosest: false
        });
    }
}

const nearbyData = [
    {
        text: i18n.NEARBY
    },
    {
        text: '500m'
    },
    {
        text: '1000m'
    },
    {
        text: '2000m'
    },
    {
        text: '5000m'
    }
];

const closestData = [
    {
        text: i18n.THE_CLOSEST
    },
    {
        text: i18n.THE_LOWEST
    }
];

const drawerStyles = {
    drawer: {
        backgroundColor: 'rgb(127,153,254)'
    },
    main: {
        paddingLeft: 3
    }
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        backgroundColor: 'rgb(255,255,255)',
        shadowColor:'rgb(90,118,254)',
        shadowOpacity: 1,
        shadowRadius: 10
    },
    context:{
        flex:1,
        marginTop:64,
        backgroundColor: 'rgb(255,255,255)'
    },
    style_text:{
        flex:1,
        fontSize:16,
    },
    row:{
        flexDirection:'column',
        justifyContent:'flex-start'
    },
    upview:{
        flexDirection:'row',
        justifyContent:'flex-start'
    },
    leftview:{
        paddingLeft:16,
        borderBottomWidth: 0.5,
        borderBottomColor: 'rgb(204,204,204)'
    },
    rightview:{
        flexDirection:'column',
        width:0.2*width,
        marginTop:0,
        marginLeft:10,
        marginRight:10,
    },
    leftUpView:{
        height: 40,
        width:width,
        flexDirection:'row',
        alignItems: 'center'
    },
    image:{
        width:16,
        height:16,
        marginLeft: -3
    },
    left_text_up:{
        fontSize:14,
        textAlign:'left',
        marginTop: 2,
        marginLeft: 4,
        width: width - 100
    },
    left_text_mid:{
        height:0.07*height,
        width:0.6*width,
        fontSize:12,
        textAlign:'left',
        color:'gray'
    },
    left_View_down:{
        marginBottom: 10,
        width:0.7*width,
        flexDirection:'column',
        alignItems: 'flex-start',
        marginLeft: 3
    },
    left_text_down:{
        fontSize:14,
        textAlign:'left',
        color:'black',
        width: 40
    },
    fastFee: {
        fontSize: 13,
        color: 'rgb(153,153,153)'
    },
    fastLineUp: {
        marginLeft:40,
        fontSize: 13,
        color: 'rgb(102,102,102)'
    },
    noChargerText:{
        fontSize:14,
        textAlign:'left',
        color:'gray',
        width:0.6*width,
        height:0.03*height,

    },
    right_image:{
        height:0.05*height,
        width:0.05*height,
        marginLeft:20,

    },
    right_text_up:{
        marginTop: 5,
        fontSize:12,
        color: 'rgb(153,153,153)',
        width: 60,
        textAlign: 'center'
    },

    right_button_down:{
        height:0.045*height,
        borderRadius:2,
        borderWidth:1,
        borderColor:'rgb(115,143,254)',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'

    },
    right_button_text:{
        color:'rgb(115,143,254)',
        textAlign:'center'
    },
    errorView: {
        marginTop: 64,
        flex: 1,
        flexDirection:'column',
        alignItems:'center',
        justifyContent:'center',
        backgroundColor: 'rgb(248,248,248)'
    },
    popChargeNotice: {
        position: 'absolute',
        left: 0,
        right: 0,
        top:64,
        backgroundColor:'#ffffff',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems:'center'
    },
    textView: {
        height: 22,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems:'center'
    },
    roundView: {
        backgroundColor: 'rgb(156,204,101)',
        height: 6,
        width: 6,
        borderRadius: 3,
        marginRight: 5
    },
    titleTab: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems:'center',
        shadowColor: 'rgba(37,46,82,0.2)',
        shadowRadius: 2,
        shadowOffset:{
            height: 1
        }
    },
    leftTab: {
        height: 40,
        width: width * 0.5,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems:'center',
        backgroundColor: 'rgb(115,143,254)',
    },
    tabText: {
        fontSize: 15,
        color: 'rgb(254,254,254)'
    },
    icon: {
        marginLeft: 5,
        backgroundColor: 'rgba(0,0,0,0)'
    },
    selectView: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems:'center',
        height: height - 104,
        backgroundColor:'rgba(0, 0, 0, 0.5)'
    },
    selectContent: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems:'center',
        backgroundColor:'white',
    },
    selectRowView: {
        flex:1,
        height: 50,
        marginLeft: 15,
        marginRight: 15,
        borderBottomWidth: 0.5,
        borderBottomColor: 'rgb(204,204,204)',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems:'center',
    },
    selectText: {
        fontSize: 14,
        color: 'rgb(102,102,102)'
    }
});
SearchListContainer.PropTypes={
    title:PropTypes.string,
    districtname:PropTypes.string,
    detail:PropTypes.array,
    dispatch: PropTypes.func,
    history: PropTypes.any,
    distance:PropTypes.string,
    positions:PropTypes.array,
    fast:PropTypes.string,
    normal:PropTypes.string,
    onSwitch: PropTypes.func
}

function mapStateToProps(state){
    const station = state.get('station').toJSON();
    station.error =  state.getIn(['root', 'error']);
    return station;
};
module.exports = connect(mapStateToProps)(TimerEnhance(SearchListContainer));
