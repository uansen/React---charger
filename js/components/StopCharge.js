/**
 * Created by HMac on 2016/9/29.
 */
import React,{Component,PropTypes} from 'react';
import {View,Text,Image,StyleSheet,TouchableOpacity, Dimensions} from 'react-native';
import { connect } from 'react-redux';
import ChargerIcon from '../utils/chargerIcons';
import i18n from '../utils/i18n';

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    backgroundColor:'#ffffff'
  },
  upview: {
    backgroundColor:'rgb(255,96,96)',
    justifyContent:'center',
    flexDirection: 'column',
    alignItems: 'center',
    height: 170,
    width: 280,
  },
  imageview: {
    height: 110,
    width: 110,
    marginTop: 20,
    borderRadius: 55,
    backgroundColor:'#E36667',
    justifyContent:'center',
    flexDirection: 'column',
    alignItems: 'center'
  },
  image: {
    width: 110,
    height: 120,
  },
  totalCost: {
    marginTop:20,
    fontSize:20,
    color:'white',
    justifyContent:'center',
    textAlign:'center',
  },
  status: {
    marginTop: 10,
    marginBottom: 10,
    fontSize:14,
    color:'white',
    justifyContent:'center',
    textAlign:'center'
  },
  middleview: {
    height: 60,
    width: 280,
    backgroundColor:'rgb(246,246,246)',
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center'
  },
  letfview: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  upText: {
    fontSize: 12,
    color: 'rgb(102,102,102)'
  },
  downText: {
    marginTop: 10,
    fontSize: 15,
    color: 'rgb(102,102,102)'
  },
  rightview: {
    marginLeft: 50,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  downView: {
    marginTop: 25,
    alignItems: 'center'
  },
  totalText: {
    textAlign: 'center',
    fontSize: 25,
  },
  buttonView: {
    marginTop: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderRadius: 2,
    borderColor: 'rgb(255,96,96)',
    backgroundColor: 'rgb(255,96,96)',
    width: 250,
    height: 40,
    flexDirection: 'column',
    justifyContent: 'center'
  },
  buttonText: {
    color: '#ffffff',
    textAlign: 'center',
    fontSize: 16
  }
})
export default class StopCharge extends Component {
  render(){
    return (
      <View style={styles.container}>
        <View style={styles.upview}>
          <View style={styles.imageview}>
            {/*<Icon name='md-battery-charging' size={60}></Icon>*/}
            <Image style={styles.image} source={require("../assets/images/battery@2x.png")}></Image>
          </View>
          <Text style={styles.status}>{i18n.STOP_HINT}</Text>
        </View>
        <View style={styles.middleview}>
          <View style={styles.letfview}>
            <Text style={styles.upText}>{i18n.CHARGED_POWER}</Text>
            <Text style={styles.downText}>{(this.props.chargingStatus ? this.props.chargingStatus.prod.toFixed(1) : "0") + 'kWh'}</Text>

          </View>
          <View style={styles.rightview}>
            <Text style={styles.upText}>{i18n.DURATION}</Text>
            <Text style={styles.downText}>{(this.props.chargingStatus ? (this.props.chargingStatus.duration / 60).toFixed(1) : "0") + 'min'}</Text>

          </View>
        </View>

        <View style={styles.downView}>
          <Text style={styles.totalText}>{"HK$" + (this.props.chargingStatus ? this.props.chargingStatus.cost.toFixed(2) : "0")}</Text>
          <TouchableOpacity onPress={this._onClose.bind(this)}>

            <View style={styles.buttonView}>
              <Text style={styles.buttonText}>{i18n.STOP}</Text>

            </View>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  _onClose(){
    this.props.onCallback();
  }

}
StopCharge.propTypes = {
  chargingStatus:PropTypes.object,
}

function mapStateToProps(state){
  return {

  };
}
module.exports = connect(mapStateToProps)(StopCharge);