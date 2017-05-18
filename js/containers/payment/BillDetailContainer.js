import React, {Component, PropTypes} from 'react';
import {StyleSheet, Text, View, Dimensions,Image} from 'react-native';
import { connect } from 'react-redux';
import HearderNavi from '../../components/HearderNavi'
import Icon from 'react-native-vector-icons/Ionicons';
import BillDetailView from '../../components/BillDetailView';
import SeparateLine from '../../components/SeparateLine';
import LinearGradient from 'react-native-linear-gradient';
import i18n from '../../utils/i18n';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    flexDirection: 'column',
    marginTop:64,
  },
  upview:{
    backgroundColor:'#9CAEFC',
    height:0.35*height,
    width:width,
  },
  imageview:{
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
  totalCost:{
    marginTop:20,
    width:width,
    fontSize:20,
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
  middleview:{
    width:width,
    height:0.1*height,
    backgroundColor:'rgb(246,246,246)',
    flexDirection:'row'
  },
  letfview:{
    height:0.1*height,
    width:0.5*width,
  },
  rightview:{
    height:0.1*height,
    width:0.5*width

  },
  downView: {
    backgroundColor: 'white'
  },
  image: {
    width: 95,
    height: 105,
  },
  gradient: {
    height:0.35*height,
    width:width,
  }

});

class BillDetailContainer extends Component {
  constructor(props){
    super(props);
    this.state = {
      orderDetail:null
    };
  }

  render() {
    return (
      <View >
        <HearderNavi title={i18n.BILL_DETAILS}></HearderNavi>
        {this._renderContent()}
      </View>
    );
  }
  _renderContent(){
    return(
        <View style={styles.container}>
          <LinearGradient start={[0.0, 1.0]} end={[1.0, 1.0]} locations={[0.0,0.5,1.0]} colors={['rgb(123,148,255)', '#8DA4FC', 'rgb(158,176,255)']}
                          style={styles.gradient}>
            <View style={styles.imageview}>
              {/*<Icon name='md-battery-charging' size={60}></Icon>*/}
              <Image style={styles.image} source={require("../../assets/images/battery@2x.png")}></Image>
            </View>
            <Text style={styles.totalCost}>{'HK$' + this.props.orderDetail.cost}</Text>
            <Text style={styles.status}>{i18n.BILL_HINT}</Text>
          </LinearGradient>

          <View style={styles.middleview}>
            <View style={styles.letfview}>
              <Text style={{color:'black',fontSize:15,textAlign:'center',marginTop:15}}>{this.props.orderDetail.prod ? this.props.orderDetail.prod.toFixed(1) + 'kWh' : 0 + 'kWh'}</Text>
              <Text style={{color:'rgb(102,102,102)', fontSize:12,textAlign:'center' }}>Energy</Text>
            </View>
            <View style={styles.rightview}>
              <Text style={{color:'black',fontSize:15,textAlign:'center',marginTop:15 }}>{this.props.orderDetail.duration ? (this.props.orderDetail.duration / 60).toFixed(1) + 'min' : 0 + 'min'}</Text>
              <Text style={{color:'rgb(102,102,102)', fontSize:12,textAlign:'center'   }}>Duration</Text>
            </View>
          </View>
          <View style={styles.downView}>
            <BillDetailView leftText={i18n.CHARGER_STATION} rightText={this.props.orderDetail.stationName}></BillDetailView>
            <SeparateLine></SeparateLine>
            <BillDetailView leftText={i18n.CHARGER_ADDRESS} rightText={this.props.orderDetail.stationAddress}></BillDetailView>
              <SeparateLine></SeparateLine>
                <BillDetailView leftText={i18n.CHARGER_DATE} rightText={this.props.orderDetail.time}></BillDetailView>
            <BillDetailView ></BillDetailView>
            <BillDetailView ></BillDetailView>
          </View>
        </View>

    )

  }
}

BillDetailContainer.propTypes = {
  dispatch: PropTypes.func,
  history: PropTypes.any,
  totalPrice:PropTypes.string,
  chargeStatus:PropTypes.string

};

function mapStateToProps(state){
  const orderDetail = state.getIn(['bill','orderDetail']).toJSON();
  console.log('@@ orderDetail' + orderDetail);
  return{
      orderDetail:state.getIn(['bill','orderDetail']).toJSON()
  }
}

module.exports = connect(mapStateToProps)(BillDetailContainer);
