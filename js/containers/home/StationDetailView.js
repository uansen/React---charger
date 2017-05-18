import React, { Component, PropTypes } from 'react';
import { StyleSheet, View, Image, Text,TextInput,TouchableHighlight,TouchableOpacity} from 'react-native';
import ChargerIcon from '../../utils/chargerIcons';
import MapLinking from 'react-native-map-linking';
import i18n from '../../utils/i18n';

const styles = StyleSheet.create({
  upView:{
    height: 100,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgb(241,241,241)'
  },
  infor:{
    marginTop: 20,
    marginLeft: 15,
    width: 170,
    flexDirection: 'column',
    justifyContent: 'flex-start'
  },
  name:{
    flex: 1,
    color: 'black',
    fontSize: 15,
    fontWeight: 'bold'
  },
  address:{
    flex: 3,
    color: 'rgb(153,153,153)',
    fontSize: 12
  },
  distanceView: {
    marginRight: 15,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  navView: {
    marginTop: 10,
    height: 45,
    width: 45,
    borderWidth: 1,
    borderRadius: 22.5,
    borderColor: 'rgb(115,143,254)',
    backgroundColor: 'rgb(115,143,254)',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor:'#252e52',
    shadowOpacity: 0.5,
    shadowRadius:1,
    shadowOffset:{
      height: 0.5
    }
  },
  distanceText: {
    marginTop: 10,
    fontSize: 12,
    color: 'rgb(153,153,153)'
  },
  downView: {
    height: 135,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  fastView: {
    flex: 1,
    marginLeft: 15,
    marginRight: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomColor: 'rgb(204,204,204)',
    borderBottomWidth: 1
  },
  leftView: {
    width: 160,
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  fast: {
    height: 20,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  dot1:{
    backgroundColor: '#9CCC65',
    width: 6,
    height: 6,
    borderRadius: 3
  },
  fastLabel:{
    marginLeft: 10,
    color: 'black',
    fontSize:14
  },
  waiting: {
    marginLeft: 16,
    color: 'rgb(115,143,254)',
    fontSize:13
  },
  waitingTime: {
    marginLeft: 5,
    color: 'rgb(115,143,254)',
    fontSize:13
  },
  fastTimeIcon:{
    color: 'rgb(204,204,204)',
    fontSize:14
  },
  fastTimeText:{
    color: 'rgb(153,153,153)',
    fontSize:11
  },
  fastDollaIcon:{
    color: 'rgb(204,204,204)',
    fontSize:14
  },
  fastDollaText:{
    marginLeft: 10,
    color: 'rgb(153,153,153)',
    fontSize: 13
  },
  dot2:{
    backgroundColor: '#9CCC65',
    width: 6,
    height: 6,
    borderRadius: 3,
    position: 'absolute',
    left: 16,
    top: 230
  },
  normalLabel:{
    position: 'absolute',
    left: 26,
    top: 225,
    color: 'black',
    fontSize:12
  },
  normalTimeIcon:{
    position: 'absolute',
    left: 90,
    top: 224,
    color: 'rgb(204,204,204)',
    fontSize:14
  },
  normalTimeText:{
    position: 'absolute',
    left: 106,
    top: 225,
    color: 'rgb(153,153,153)',
    fontSize:11
  },
  normalDollaIcon:{
    position: 'absolute',
    left: 135,
    top: 224,
    color: 'rgb(204,204,204)',
    fontSize:14
  },
  normalDollaText:{
    position: 'absolute',
    left: 150,
    top: 225,
    color: 'rgb(153,153,153)',
    fontSize:11
  },
  rightView: {
    width: 80,
    height: 32,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgb(115,143,254)',
    borderWidth: 1,
    borderColor: 'rgb(115,143,254)',
    borderRadius: 2

  },

  slowView: {
    flex: 1,
    marginLeft: 15,
    marginRight: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },

  leftSep:{
    position: 'absolute',
    left: 16,
    top: 177,
    height: 1,
    width: 26,
    backgroundColor: '#cccccc'
  },
  rightSep:{
    position: 'absolute',
    right: 16,
    top: 177,
    height: 1,
    width: 26,
    backgroundColor: '#cccccc'
  },
  labelSepWrapper:{
    position: 'absolute',
    left: 18,
    right: 18,
    top: 171,
    height: 18,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center'
  },
  labelSep:{
    color: 'rgb(153,153,153)',
    fontSize: 12
  },
  reserveButton:{
    position:'absolute',
    left: 16,
    right: 16,
    bottom: 16,
    height: 40,
    flex: 1,
    borderColor:'#738FFE',
    borderRadius: 2,
    flexDirection: 'column',
    justifyContent: 'center'
  },
  buttonView: {
    height: 40,
    borderWidth: 1,
    borderRadius: 2,
    borderColor: 'rgb(115,143,254)',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonText: {
    fontSize: 14,
    color: 'rgb(255,251,251)'
  }

});

export default class StationDetailView extends Component {
  setNativeProps(nativeProps) {
    this._root.setNativeProps(nativeProps);
  }

  render() {
    return(
      <View ref={component => this._root = component}
                 style={this.props.style}>
        <View style={styles.upView}>
          <View style={styles.infor}>
            <Text style={styles.name}>{this.props.stationDetail.name}</Text>
            <TextInput style={styles.address} multiline={true} editable={false} value={this.props.stationDetail.address}/>
          </View>
          <View style={styles.distanceView}>
            <TouchableOpacity style={styles.navView} onPress={this._gogogo.bind(this)}>
              <ChargerIcon style={{color: 'white'}} name="icon_iconfont-18" size={27}/>
            </TouchableOpacity>
            <Text style={styles.distanceText}>{(this.props.stationDetail.distance ? ((this.props.stationDetail.distance/1000).toFixed(1)) : 0)+ 'km'}</Text>
          </View>
        </View>

        <View style={styles.downView}>
          <View style={styles.fastView}>
            <View style={styles.leftView}>
              <View style={styles.fast}>
                <View style={styles.dot1}/>
                <Text style={styles.fastLabel}>{i18n.FAST}</Text>
                <Text style={styles.fastDollaText}>{'HK$'+ (this.props.stationDetail.fastAccessFee || 0) +'/min'}</Text>
              </View>
              <View style={styles.fast}>
                <Text style={styles.waiting}>{ (6) + ' ' + i18n.PEOPLE_IN_FRONT}</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.rightView} onPress={() => {}}>
              <Text style={styles.buttonText}>
                {i18n.LINE_UP}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.slowView}>
            <View style={styles.leftView}>
              <View style={styles.fast}>
                <View style={styles.dot1}/>
                <Text style={styles.fastLabel}>{i18n.NORMAL}</Text>
                <Text style={styles.fastDollaText}>{'HK$'+ (this.props.stationDetail.normalAccessFee || 0) +'/min'}</Text>
              </View>
              <View style={styles.fast}>
                <Text style={styles.waiting}>{ (3) + ' ' + i18n.AVAILABLE}</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.rightView} onPress={() => {}}>
              <Text style={styles.buttonText}>
                {i18n.MAP_RESERVER}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
    </View>);
  }

  _gogogo(){
    // 唤起地图, 并让地图规划从开始到结束的路线
    MapLinking.planRoute({lat:this.props.currentPosition.latitude, lng: this.props.currentPosition.longitude, title: '起点'}, {lat:this.props.stationDetail.latitude, lng: this.props.stationDetail.longitude, title: '终点'}, 'drive');

  }
}

StationDetailView.propTypes = {
  stationDetail: PropTypes.object,
  style: PropTypes.any
};
