import React, {Component, PropTypes} from 'react';
import {Image,StyleSheet, Text, View, TouchableHighlight, Dimensions,TouchableOpacity} from 'react-native';
import { connect } from 'react-redux';
import HearderNavi from '../../components/HearderNavi'
import {Actions} from 'react-native-router-flux';
import CustomButton from '../../components/CustomButton'
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import i18n from '../../utils/i18n';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    flexDirection: 'column',
    marginTop:64,
  },
  upView:{
    backgroundColor:'#9CAEFC',
    height:0.35*height,
    width:width,
    marginBottom: 25
  },
  imageView:{
    height:0.16*height,
    marginTop:30,
    width:0.16*height,
    borderRadius:0.08*height,
    backgroundColor:'#A8BAFD',
    marginLeft:(width-0.16*height)/2,
    marginRight:(width-0.16*height)/2,
    justifyContent:'center',
    flexDirection: 'column',
    paddingLeft:0.05*height,
    paddingRight:0.05*height,
    alignItems: 'center'
  },
  image: {
    width: 74.5,
    height: 43.5,
  },
  totalCost:{
    marginTop:20,
    width:width,
    fontSize:25,
    color:'white',
    justifyContent:'center',
    textAlign:'center',
    backgroundColor: 'rgba(0,0,0,0)'
  },
  status:{
    fontSize:16,
    marginTop: 5,
    color:'white',
    justifyContent:'center',
    textAlign:'center',
    backgroundColor: 'rgba(0,0,0,0)'
  },
  buttonView:{
    flex: 1,
    flexDirection: 'row',
    margin: 15
  },
  button: {
    flex: 1,
    borderColor: '#265a8f',
    backgroundColor: 'rgb(115,143,254)',
    borderRadius: 2,
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
    height: 40,
    shadowColor:'rgb(37,46,82)',
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.4
  },
  buttonText: {
    textAlign: 'center',
    color: '#ffffff',
    fontSize: 14,
  },
  bottomButton: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 10
  },
  bottomView: {
    flex: 1,
  },
  bottomText: {
    textAlign: 'center',
    color: 'rgb(115,143,254)',
    fontSize: 14,
  },
  gradient: {
    height:0.35*height,
    width:width,
    marginBottom: 25
  }
});

class BalanceContainer extends Component {
  constructor(props){
    super(props);
    this.state = {
      position: null,
      mapRegion: {
        latitude: 31.22,
        longitude: 121.48,
        latitudeDelta: 0.3,
        longitudeDelta: 0.3
      }
    };
  }

  render() {
    return (
      <View >
        <HearderNavi title={i18n.MENU_BLANCE}></HearderNavi>
        {this._renderContent()}
      </View>
    );
  }
  _renderContent(){
    return(
      <View style={styles.container}>
        <LinearGradient start={[0.0, 1.0]} end={[1.0, 1.0]} locations={[0.0,0.5,1.0]} colors={['rgb(123,148,255)', '#8DA4FC', 'rgb(158,176,255)']}
                        style={styles.gradient}>
            <View style={styles.imageView}>
              {/*<Icon name='md-battery-charging' size={60}></Icon>*/}
              <Image style={styles.image} source={require("../../assets/images/balance@2x.png")}></Image>
            </View>
            <Text style={styles.totalCost}>{'HK$213'}</Text>
            <Text style={styles.status}>{i18n.BLANCE_ACCOUNT}</Text>
        </LinearGradient>


          <TouchableOpacity style={styles.buttonView} onPress={this._onTopUpClick.bind(this)}>
            <View style={styles.button}>
              <Text style={styles.buttonText}>{i18n.BLANCE_TOP}</Text>
            </View>
          </TouchableOpacity>

        <TouchableOpacity style={styles.bottomButton} onPress={this._commonProblemsAction.bind(this)}>
          <View >
            <Text style={styles.bottomText}>{i18n.BLANCE_COMMON}</Text>
          </View>
        </TouchableOpacity>
      </View>

    )
  }
  //点击Top up 按钮
  _onTopUpClick(){
    Actions.topUp();
  }
  //点击common problem按钮
  _commonProblemsAction(){
    console.log('_commonProblemsAction')
  }
}

BalanceContainer.propTypes = {
  dispatch: PropTypes.func,
  history: PropTypes.any,
  balance:PropTypes.string,
};


function mapStateToProps(state){
  return {};
};

module.exports = connect(mapStateToProps)(BalanceContainer);
