import React, {Component, PropTypes} from 'react';
import {ActivityIndicator, Image , StyleSheet, Text,
  TouchableHighlight, View, Platform, Animated,Dimensions,Modal,NetInfo,TouchableOpacity,Easing} from 'react-native';
import MapView from 'react-native-maps';
import { connect } from '../../connect';
import MapNavigationBar from './MapNavigationBar';
import Drawer from 'react-native-drawer';
import DrawerContent from './DrawerContent';
import {Actions} from 'react-native-router-flux';
import {openConnector} from '../../actions/connectorAction';
import {closeConnector} from '../../actions/connectorAction';
import Icon from 'react-native-vector-icons/Ionicons';
import Button from 'apsl-react-native-button';
import LatLng from '../../mapCluster/LatLng';
import Marker from '../../mapCluster/Marker';
import MarkerClusterer from '../../mapCluster/MarkerClusterer';
import getZoomLevel from '../../mapCluster/zoomLevel';
import AnnotationView from './AnnotationView';
import {diagonalDistanceOfRegion} from '../../mapCluster/distance';
import {getConnectionStatus} from '../../actions/connectorAction';
import {getNearestChargeStations, getStationDetail, removeCurrentStation, setCurrentPosition} from '../../actions/stationAction';
import {clearConnectorDetail} from '../../actions/connectorAction';
import {getConnectorDetail} from '../../actions/connectorAction';
import CustomAlertView from '../../components/CustomAlertView';
import StationDetailView from './StationDetailView';
import {changeOrderStatusOn,changeOrderStatusOff} from '../../actions/loginAction';
import {checkNet} from '../../actions/networkAction';
import {getBillDetail} from '../../actions/billAction';
import ChargeNotice from '../charge/ChargeNotice';
import StationFilter from './StationFilter';
import i18n from '../../utils/i18n';
import Reserver from './Reserver';
import LinearGradient from 'react-native-linear-gradient';
import Countdown from './Countdown'

const {width,height} = Dimensions.get('window');
const {heightScale,widthScale} = {heightScale: height / 667 , widthScale: width / 375};
var orderID = null;
var connectorID = null;
var orderStatus = null;

function stringToTime(string) {
  return new Date(parseInt(string)).toLocaleString().replace(/:\d{1,2}$/,' ');
}

class MapContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      position: null,
      mapRegion: {
        latitude: 22.52,
        longitude: 113.91,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1
      },
      annotations: [], // annotations to display, considering cluster
      zoomLevel: 0,
      animationType: 'slide',
      visible:false,
      transparent: true,
      isHide:true,
      animating:true,
      isShowChargeNotice: false,
      bounceValue: new Animated.Value(1),
      isShowFilter: true,
      filterY: new Animated.Value(0),
      filterScale: new Animated.Value(1),
      filterOpacity: new Animated.Value(0),
      stationStatus: 1,
      fastChargerSwitch: 1,
      freeChargerSwitch: 1,
      buttonText: i18n.MAP_CHARGER,
      connectorId: null,
      stationId: null,
      isOpen: false,
      resultPoint: {
        latitude: null,
        longitude: null,
        name: null
      },
    };

    this.state.position = {
      latitude: this.state.mapRegion.latitude,
      longitude: this.state.mapRegion.longitude
    };

    this.state.zoomLevel = getZoomLevel(this.state.mapRegion);

    // handler for menu drawer
    this._drawer = null;
    this._connectionEventHandler = this._connectionChanged.bind(this);
  }

  componentDidMount() {
    this.currentTimeOut = setTimeout(()=>{this._setCurrentPosition(true, true)},4000);
    this._onChangeStatus();
    // this.props.dispatch(getNearestChargeStations(this.state.mapRegion.longitude, this.state.mapRegion.latitude,
    //   Math.round(1000 * diagonalDistanceOfRegion(this.state.mapRegion)),this.state.stationStatus));

    storage.load({
      key: 'autoUser',
      autoSync: true,
      syncInBackground: true
    }).then(ret => {
      if (ret.mobile) {
        storage.load({
          key: ret.mobile,
          id: "orderID",
          autoSync: true
        }).then(ret=> {
          orderID = ret.orderId;
          connectorID = ret.connectorId;
          orderStatus = ret.orderStatus;

          if (connectorID && orderID) {
            // this.props.dispatch(getConnectorDetail(connectorID));
            this.setState({
              connectorId: connectorID
            });
            this.props.dispatch(getConnectionStatus(orderID));

            this.interval = setInterval(()=> {
              this.props.dispatch(getConnectionStatus(orderID));
            }, 8000);
          }
        }).catch(error=> {
          console.log("error=", error)
        });
      }
    }).catch(error=> {
      console.log("error=", error)
    });

  }

  componentWillUnmount(){
    NetInfo.isConnected.removeEventListener('change', this._connectionEventHandler);
    this.interval && clearInterval(this.interval);
    this.currentTimeOut && clearTimeout(this.currentTimeOut);
    orderStatus = 0,
    this._onDisconnectClick();
  }

  componentWillReceiveProps(nextProps) {
      if(!this.props.orderId && nextProps.orderId && this.props.connectorSpec){//持久化订单号
        storage.load({
          key: 'autoUser',
          autoSync: true,
          syncInBackground: true
        }).then(ret => {
          if (ret.mobile) {
            storage.save({
              key: ret.mobile,
              id: "orderID",
              rawData: {
                orderId: nextProps.orderId,
                connectorId: this.props.connectorSpec.id,
                orderStatus: 1
              }
            })
          }
        }).catch(error=> {
          console.log("error=", error)
        });
        // this.props.dispatch(changeOrderStatusOn());
      }

      if(!this.props.connectorSpec && nextProps.connectorSpec){
        this._setVisible(true);
      }

      if(orderStatus !== 1){
        if((!this.props.isOpen && nextProps.isOpen)|| (nextProps.chargingStatus && !nextProps.checkoutInfo)){//开始充电,将orderstatus改为1
          this.interval = setInterval(()=>{
            if (this.props.orderId){
              this.props.dispatch(getConnectionStatus(this.props.orderId));
            }

          }, 8000);

          orderStatus = 1;
        }
      }

    if (nextProps.annotations && nextProps.annotations !== this.props.annotations) {
      this._clusterAnnotations(nextProps.annotations.toJSON());
    }

    if(nextProps.currentPosition){
      const lat = nextProps.currentPosition.get('lat');
      const lng = nextProps.currentPosition.get('lng');
      const latitudeDelta = nextProps.currentPosition.get('latitudeDelta');
      const longitudeDelta = nextProps.currentPosition.get('longitudeDelta');
      const name = nextProps.currentPosition.get('name');
      const chargerId = nextProps.currentPosition.get('chargerId');
      if(lat !== 1 && lat !== 0 && latitudeDelta){
        this.currentTimeOut && clearTimeout(this.currentTimeOut);
        this._animatedMapPositionTo(lng, lat,latitudeDelta,longitudeDelta);
        if (chargerId && chargerId.length > 0){
          this._onChargerDetail(lat,lng,chargerId);

        }else {
          this.setState({
            resultPoint: {
              latitude: lat,
              longitude: lng,
              name: name
            }
          });
        }

        this.props.dispatch(setCurrentPosition(0, 0,0,0));
      }
    }

    if(!this.props.checkoutInfo && nextProps.checkoutInfo){//关闭充电将orderstatus改为0

      this.interval && clearInterval(this.interval);

      storage.load({
        key: 'autoUser',
        autoSync: true,
        syncInBackground: true
      }).then(ret => {
        if (ret.mobile) {
          storage.save({
            key: ret.mobile,
            id: "orderID",
            rawData: {
              orderStatus: 0
            }
          })
        }
      }).catch(err => {
        console.log(err.message);
      });

      storage.load({
        key: 'autoUser',
        autoSync: true,
        syncInBackground: true
      }).then(ret => {
        if (ret.mobile) {
          storage.load({
            key: ret.mobile,
            id: "orderID",
            autoSync: true
          }).then(ret=> {
            orderStatus = ret.orderStatus;
          }).catch(error=> {
            console.log("error=", error)
          });
        }
      }).catch(error=>{console.log("error=",error)});

      this._hideModalConnectorInfomation();
      this._setVisible(false);

      this.props.dispatch(getBillDetail(nextProps.checkoutInfo.cost,nextProps.checkoutInfo.name,nextProps.checkoutInfo.address,stringToTime(nextProps.checkoutInfo.createTime),nextProps.checkoutInfo.duration,nextProps.checkoutInfo.prod,this.props.orderId));
      Actions.billDetail();

    }

    if (nextProps.error){
      this.interval && clearInterval(this.interval);
    }
    this._showTitle(nextProps.connectorSpec);

  }

  _onClickSearchHistory(){
    this.props.dispatch(setCurrentPosition(1,1,this.state.mapRegion.latitudeDelta,this.state.mapRegion.longitudeDelta));
    Actions.searchhistory();
  }
  _onClickSearch(){
    this.setState({
      isOpen: false
    });
    this.props.dispatch(setCurrentPosition(1,1,this.state.mapRegion.latitudeDelta,this.state.mapRegion.longitudeDelta));
    setTimeout(()=>{
      this.props.onSwitch();
    },400);
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

          <Animated.View style={[styles.container,{transform: [{scale: this.state.bounceValue}]}]}>
            <MapNavigationBar onMenuClicked={this._toggleMenu.bind(this)} disabled
                              onTextAreaClicked={this._onClickSearchHistory.bind(this)}
                              showsUserLocation
                              onSwitchClicked={this._onClickSearch.bind(this)}
                              onFilterClicked={this._isShowFilter.bind(this)}
                              iconName = 'icon_iconfont-02'
            />
            <MapView
                ref="ref_map"
                style={styles.map}
                onRegionChange = {this._onRegionChange.bind(this)}
                onRegionChangeComplete={this._onRegionChangeComplete.bind(this)}
                region={Object.assign({}, this.state.mapRegion)}
                annotations={this.state.annotations}
                showsUserLocation showsCompass
              >
              {
                this.state.annotations.map( (annotation, index) => (
                  <MapView.Marker key={index} coordinate={{latitude: annotation.center_.lat_,
                        longitude: annotation.center_.lng_}}  onPress={() => this._onAnnotationPressed(annotation)}>
                    <AnnotationView item={annotation} stationId={this.state.stationId} />
                  </MapView.Marker>
                ))
              }
              {
                this.state.resultPoint.latitude &&
                <MapView.Marker coordinate={{latitude: this.state.resultPoint.latitude, longitude: this.state.resultPoint.longitude}}
                                title={this.state.resultPoint.name}>
                  <Image style={{width:23 * widthScale, height:23 * heightScale}} source={require('../../assets/images/icon_geo.png')} />
                </MapView.Marker>
              }
            </MapView>

            <Countdown style={styles.countdown}/>
            <View style={styles.connectButton}>
              <TouchableOpacity style={styles.locator}
                                onPress={this._setCurrentPosition.bind(this, true, true)}>
                <Icon style={styles.locatorIcon} name="ios-locate-outline"
                      size={28} color="rgb( 102,102,102)" />
              </TouchableOpacity>

              <TouchableOpacity onPress={this._connectCharger.bind(this)}>
                <LinearGradient start={[0.0, 1.0]} end={[0.0, 0.0]} locations={[0.0,0.5,1.0]} colors={['rgb(103,133,354)', 'rgb(119, 148, 251)', 'rgb(140,163,254)']}
                                style={styles.connectView}>
                    <Text style={styles.connectText}>{this.state.buttonText}</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
            {
              this._renderStateDetail()
            }
            <Modal animationType={this.state.animationType}
                   transparent={this.state.transparent}
                   visible={this.state.visible}>
              <TouchableOpacity onPress={this._onHide.bind(this)}>
                    <View style={styles.maskcontainer}>
                        <View style={styles.maskinnerContainer}>
                          <CustomAlertView onHideAlert={this._onDisconnectClick.bind(this)} detailInfo={this.props.detailInfo} chargingStatus={this.props.chargingStatus}
                          isFetching={this.props.isFetching} checkoutInfo={this.props.checkoutInfo} error={this.props.error} isOpen={this.props.isOpen} orderId={this.props.orderId}
                          onClick={this._onStart.bind(this)} onOkStrop={this._onStop.bind(this)} orderStatus={orderStatus}/>
                        </View>
                    </View>
              </TouchableOpacity>
            </Modal>

          </Animated.View>

          {this._renderChargeNotice()}
          {!this.state.isShowFilter ? this._renderFilter() : null}

          <Reserver />
        </Drawer>
    );
  }

  _renderStateDetail(){
    return (
      <Modal animationType="slide" transparent
             visible={this.props.currentStationDetail !== null}>
        <TouchableOpacity onPress={() => this.props.dispatch(removeCurrentStation())}
                            style={styles.popOverMask}>
            <StationDetailView style={styles.popOver} currentPosition={this.state.position}
                               stationDetail={this.props.currentStationDetail}
            />
        </TouchableOpacity>
      </Modal>
    );
  }

  _renderChargeNotice(){
    return (
      <Modal animationType="slide" visible={this.state.isShowChargeNotice} transparent >
        <TouchableOpacity style={styles.popChargeNotice} onPress={()=> console.log('showChargeNotice')} >
          <View>
            <ChargeNotice onCallback={this._removeChargeNotice.bind(this)}/>
          </View>

        </TouchableOpacity>
      </Modal>
    );
  }

  _renderFilter(){
    return (
      <Animated.View style={[styles.popStationFilter,{opacity: this.state.filterOpacity}, {transform: [{translateY: this.state.filterY}, {scale: this.state.filterScale}]}]}>
        <TouchableOpacity onPress={()=> this._isHideFilter()} >
          <View>
            <StationFilter onChangeStatus={this._onChangeStatus.bind(this)} />
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
        duration: 500,
        easing: Easing.linear
      }),
      // Animated.spring(this.state.filterY, {
      //   toValue: -100
      // })
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
          if (ret.availableChargerSwitch){
            this.state.stationStatus = 1;
          }else {
            this.state.stationStatus = 0;
          }
          if (ret.freeChargerSwitch){
            this.state.freeChargerSwitch = 1;
          }else {
            this.state.freeChargerSwitch = 0;
          }
          if (ret.fastChargerSwitch){
            this.state.fastChargerSwitch = 1;
          }else {
            this.state.fastChargerSwitch = 0;
          }
          this.setState(this.state);
        }).catch(err => {
          console.log(err.message);
        });
      }
    }).catch(err => {
      console.log(err.message);
    });

  }

  _removeChargeNotice(){
    this.setState({
      isShowChargeNotice: false
    });

    storage.load({
      key: 'autoUser',
      autoSync: true,
      syncInBackground: true
    }).then(ret => {
      if (ret.mobile) {
        storage.save({
          key: ret.mobile,
          id: "chargeNotice",
          rawData: {
            isShowChargeNotice: false
          }
        })
      }
    }).catch(err => {
      console.log(err.message);
    });

    Actions.cameraQrContainer();
  }
  _setVisible(visible){
    this.setState({visible:visible});
    this.setState({isHide:!visible});

  }
  _onDisconnectClick(){
    this.props.dispatch(clearConnectorDetail());
    this._setVisible(false);
  }

  _showTitle(connectorSpec){
    let buttonText = i18n.MAP_CHARGER
    if((this.props.chargingStatus) && this.props.isOpen){
      const prod = (this.props.chargingStatus.prod.toFixed(1) + 'kWh');
      const duration = ((this.props.chargingStatus.duration/60).toFixed(1)+"min");
      const cost =("HK$"+this.props.chargingStatus.cost.toFixed(1));
      buttonText = (prod + " - " + duration + " - " + cost);
    }else if(this.props.connectorSpec && connectorSpec && !this.props.chargingStatus){
      buttonText = i18n.MAP_CONNECTED;
    }else {
      buttonText =  i18n.MAP_CHARGER;
    }

    this.setState({
      buttonText: buttonText
    });
  }

  _onStart(){
    if (this.props.detailInfo && this.props.detailInfo.id) {
      this.props.dispatch(openConnector(this.props.detailInfo.id));
    }
  }

  _onStop(){
    this.props.dispatch(closeConnector(this.props.orderId ? this.props.orderId : orderID));
    this._setVisible(false);
    this.interval && clearInterval(this.interval);

  }
  _onHide(){
    this._setVisible(false);
    this._showTitle(true);
  }

  // 获取当前定位
  _setCurrentPosition(bAnimatedTo, highAccuracy) {
    navigator.geolocation.getCurrentPosition(position => {
      if (position && position.coords) {
        this.setState({
          position: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          },
          resultPoint: {
            latitude: null,
            longitude: null,
            name: null
          }
        });
        if(bAnimatedTo){
          this._animatedMapPositionTo(position.coords.longitude + 0.004, position.coords.latitude - 0.004,0.1,0.1);
        }
      }
    }, error => {
      console.log('@@@@ error while get position ', error);
    }, {
      enableHighAccuracy: highAccuracy || false,
      timeout: 5000,
      maximumAge: 1000
    });
  }

  // 地图定位到经纬度,并获取充电站
  _animatedMapPositionTo(longitude, latitude,latitudeDelta,longitudeDelta){
    this.state.mapRegion ={
      latitude: latitude,
      longitude: longitude,
      latitudeDelta: latitudeDelta ? latitudeDelta : this.state.mapRegion.latitudeDelta,
      longitudeDelta: longitudeDelta ? longitudeDelta : this.state.mapRegion.longitudeDelta
    };
    this.setState(this.state);

    this.props.dispatch(getNearestChargeStations(longitude, latitude,
      Math.round(1000 * diagonalDistanceOfRegion(this.state.mapRegion)),this.state.stationStatus));
  }

  _onRegionChange(region) {
    const newLevel = getZoomLevel(region);
    this.setState({
      zoomLevel: newLevel,
      mapRegion: region
    });
  }

  _onRegionChangeComplete(region) {
    const newLevel = getZoomLevel(region);
    this.setState({
      zoomLevel: newLevel,
      mapRegion: region
    });
    const newDistance = Math.round(1000 * diagonalDistanceOfRegion(region));
    this.props.dispatch(getNearestChargeStations(region.longitude, region.latitude, newDistance,this.state.stationStatus));
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

  _clusterAnnotations(points) {
    const markers = points.map(point => {
      const latLng = new LatLng(point.latitude, point.longitude);
      const marker = new Marker(point, latLng);
      return marker;
    });

    const markerClusterer = new MarkerClusterer(markers, {
      zoom: this.state.zoomLevel
    });

    const clusters = markerClusterer.createClusters();
    // console.log('@@@@@ annotation count ' + clusters.length + ' at zoom level ' + this.state.zoomLevel);

    this.setState({
      annotations: clusters
    });
    console.log('@@@@@@ annotations ', this.state.annotations);
  }

  _onAnnotationPressed(annotation) {
    console.log('@@@@@ latitudeDelta : ' + this.state.mapRegion.latitudeDelta);
    this.setState({
      stationId: annotation.getMarkers()[0].getInfo().id
    });

    if(annotation.getMarkers().length === 1){
      const value = this.state.mapRegion.latitudeDelta === 0.1 ? 0.0020 : 0.0016;
      const deltaY = diagonalDistanceOfRegion({
        latitude: annotation.center_.lat_,
        longitude: annotation.center_.lng_,
        latitudeDelta: this.state.mapRegion.latitudeDelta,
        longitudeDelta: this.state.mapRegion.longitudeDelta
      }) * value;
      const newRegion = {
        latitude: annotation.center_.lat_ + deltaY,
        longitude: annotation.center_.lng_,
        latitudeDelta: this.state.mapRegion.latitudeDelta,
        longitudeDelta: this.state.mapRegion.longitudeDelta
      };
      // console.log('@@@@@ delta : ' + deltaY + '   d ' + diagonalDistanceOfRegion(newRegion));

      this.refs.ref_map.animateToRegion(newRegion, 800);

      setTimeout(()=> {
        const newLevel = getZoomLevel(newRegion);
        this.setState({
          zoomLevel: newLevel,
          mapRegion: newRegion,
          stationId: annotation.getMarkers()[0].getInfo().id
        });
      }, 2000);

      this.props.dispatch(getStationDetail(annotation.getMarkers()[0].getInfo().id, this.state.position.longitude,
        this.state.position.latitude));

    }else{
      const newRegion = {
        latitude: annotation.center_.lat_,
        longitude: annotation.center_.lng_,
        latitudeDelta: this.state.mapRegion.latitudeDelta / 1.5,
        longitudeDelta: this.state.mapRegion.longitudeDelta / 1.5
      };
      this.refs.ref_map.animateToRegion(newRegion, 1000);
    }
  }

  _onDrawerMenuItemClick(menuKey) {
    switch (menuKey) {
      case 'billList':
        Actions.billList();
        break;
      case 'balance':
        Actions.balance();
        break;
      case 'profile':
        Actions.profile();
        break;
      case 'settings':
        Actions.settings();
        break;
      default:
        break;
    }
  }

  _connectCharger() {
    if(!this.props.connectorSpec && (orderStatus === 0 || orderStatus === null)){

      // 读取
      storage.load({
        key: 'autoUser',
        autoSync: true,
        syncInBackground: true
      }).then(ret => {
        if (ret.mobile) {
          storage.load({
            key: ret.mobile,
            id: 'chargeNotice',
            autoSync: true,
            syncInBackground: true
          }).then(ret => {
            Actions.cameraQrContainer();
          }).catch(err => {
            console.log(err.message);
            this.state.isShowChargeNotice = true;
            this.setState(this.state);
          });
        }
      }).catch(err => {
        console.log(err.message);
      });

    }else{
      if (this.state.connectorId){
        this.props.dispatch(getConnectorDetail(this.state.connectorId));
      }

      this.setState({isHide:false});
      this._setVisible(true);
    }
  }
  // 未充电,则清除当前所获取的枪对象
  _hideModalConnectorInfomation(){
    this.props.dispatch(clearConnectorDetail());
  }

  _connectionChanged(isConnected){
    console.log('@@@@ is connected', isConnected);
  }

  _onChargerDetail(latitude,longitude,chargerId){

    const value = this.state.mapRegion.latitudeDelta === 0.1 ? 0.0020 : 0.0016;
    const deltaY = diagonalDistanceOfRegion({
        latitude: latitude,
        longitude: longitude,
        latitudeDelta: this.state.mapRegion.latitudeDelta,
        longitudeDelta: this.state.mapRegion.longitudeDelta
      }) * value;
    const newRegion = {
      latitude: latitude + deltaY,
      longitude: longitude,
      latitudeDelta: this.state.mapRegion.latitudeDelta,
      longitudeDelta: this.state.mapRegion.longitudeDelta
    };

    this.refs.ref_map.animateToRegion(newRegion, 800);
    const newLevel = getZoomLevel(newRegion);
    this.setState({
      zoomLevel: newLevel,
      mapRegion: newRegion
    });

    setTimeout(()=> {
      this.props.dispatch(getStationDetail(chargerId, this.state.position.longitude,
        this.state.position.latitude));
    },1000);

  }
}

const styles = StyleSheet.create({
  maskcontainer:{
    flex: 1,
    justifyContent: 'center',
    backgroundColor:'rgba(0, 0, 0, 0.5)'
  },
  maskinnerContainer: {
    marginTop: 0.435*height
  },
  popOverMask:{
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    top:0,
    backgroundColor:'rgba(0, 0, 0, 0)',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems:'center'
  },
  popOver:{
    width: 270 * widthScale,
    height: 235 * heightScale,
    backgroundColor:'#ffffff',
    borderRadius: 2,
    shadowColor:'rgb(10,12,22)',
    shadowOpacity: 0.5,
    shadowRadius: 6,
    shadowOffset:{
      height: 1
    }
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: 'rgb(127,153,254)',
    shadowColor:'rgb(90,118,254)',
    shadowOpacity: 1,
    shadowRadius: 10
  },
  map: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    ...Platform.select({
      ios: {
        top: 64
      },
      android: {
        top: 54
      }
    }),
    borderWidth: 0
  },
  locator: {
    position: 'absolute',
    left: 20 * widthScale,
    bottom: 2 * heightScale,
    width: 39 * widthScale,
    height: 39 * widthScale,
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
    borderColor: 'rgb(10,12,22)',
    borderRadius: 19.5 * widthScale,
    backgroundColor: '#ffffff',
    shadowColor:'rgb(10,12,22)',
    shadowOffset: {
      width: 0,
      height: 0.2
    },
    shadowOpacity: 0.3,
    shadowRadius: 2
  },
  locatorIcon: {
    marginTop: 2 * heightScale,
    backgroundColor: 'rgba(0,0,0,0)'
  },
  pinWrapper: {
    width: 30 * widthScale,
    height: 30 * heightScale
  },
  pinCircleWrapper:{
    position: 'absolute',
    width: 26 * widthScale,
    height: 26 * heightScale
  },
  pinBg: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: 28 * widthScale,
    height: 28 * widthScale,
    borderRadius: 14 * widthScale,
    backgroundColor:'#ffffff',
    shadowColor:'#555555',
    shadowOffset: {
      width: 2,
      height: 2
    },
    shadowOpacity: 0.6,
    shadowRadius: 1
  },
  pinCircle:{
    position: 'absolute',
    left: 2 * widthScale,
    top: 2 * heightScale
  },
  pinText: {
    position: 'absolute',
    left: 9 * widthScale,
    top: 5 * heightScale,
    color: '#666666',
    fontSize: 14
  },
  countdown: {
    position: 'absolute',
    left: 10 * widthScale,
    bottom: 75 * heightScale
  },
  connectButton: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 15 * heightScale,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  connectView: {
    borderRadius: 20 * widthScale,
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
    height: 40 * heightScale,
    width: 230 * widthScale,
    shadowColor:'rgba(37,46,82,0.4)',
    shadowOffset: {
      height: 0.5
    },
    shadowOpacity: 1,
    shadowRadius: 1
  },
  connectText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 15,
    backgroundColor: 'rgba(0,0,0,0)'
  },
  centering: {
    position: 'absolute',
    left: width / 2 - 10 * widthScale,
    top: height / 2 - 40 * heightScale
  },
  popChargeNotice: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor:'rgba(0, 0, 0, 0.8)',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems:'center'
  },
  popStationFilter: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 64 * heightScale,
    backgroundColor:'#ffffff',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems:'center'
  }
});

const drawerStyles = {
  drawer: {
    backgroundColor: 'rgb(127,153,254)'
  },
  main: {
    paddingLeft: 3 * widthScale
  }
};

MapContainer.propTypes = {
   dispatch: PropTypes.func,
   annotations: PropTypes.any,
   isOpen: PropTypes.bool, // 调用open接口,如果有则显示ChargingContainer
   currentPosition: PropTypes.object, // 当前经纬度, 从别的Container传进来
   connectorSpec: PropTypes.object, // 通过扫码连接上的充电枪对象, 如果存在则显示ConnectedContainer,
   orderId:PropTypes.string,
   isFetchingDetail: PropTypes.bool,
   currentStationDetail: PropTypes.object,
   chargingStatus:PropTypes.object,
   error:PropTypes.object,
   isFetching:PropTypes.bool,
   detailInfo:PropTypes.object,
   checkoutInfo:PropTypes.object,
   orderStatus:PropTypes.number,
   onSwitch: PropTypes.func
};

function mapStateToProps(state){
  return {
    annotations: state.getIn(['station', 'currentStationList']),
    isOpen:state.getIn(['connector','isOpen']),
    connectorSpec: state.getIn(['connector', 'connectorSpec']) ? state.getIn(['connector', 'connectorSpec']).toJSON() : null,
    currentPosition: state.getIn(['station', 'currentPosition']),
    orderId:state.getIn(['connector','orderId']) ? state.getIn(['connector','orderId']).toString() : null,
    isFetchingDetail: state.getIn(['station', 'isFetchingDetail']),
    currentStationDetail: state.getIn(['station', 'currentStationDetail']) ? state.getIn(['station', 'currentStationDetail']).toJSON() : null,
    chargingStatus:state.getIn(['connector','chargingStatus']) ? state.getIn(['connector','chargingStatus']).toJSON():null,
    detailInfo : state.getIn(['connector', 'connectorSpec']) ? state.getIn(['connector', 'connectorSpec']).toJSON() : null,
    error: state.getIn(['connector', 'error']) ? state.getIn(['connector', 'error']).toJSON() : null,
    isFetching: state.getIn(['connector', 'isFetching']),
    checkoutInfo:state.getIn(['connector','checkoutInfo'])? state.getIn(['connector','checkoutInfo']).toJSON() :null,
    orderStatus:state.getIn(['login','user','orderStatus']),
    isShowChargeNotice: state.getIn(['station', 'isShowChargeNotice'])
  };
}

module.exports = connect(mapStateToProps)(MapContainer);
