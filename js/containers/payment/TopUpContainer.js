import React, {Component, PropTypes} from 'react';
import {Image,StyleSheet, Text, View, TouchableHighlight, Dimensions,TouchableOpacity} from 'react-native';
import { connect } from 'react-redux';
import HearderNavi from '../../components/HearderNavi'
import {Actions} from 'react-native-router-flux';
import CustomButton from '../../components/CustomButton'
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import i18n from '../../utils/i18n';
import ChargerIcons from '../../utils/chargerIconstwo';

class TopUpContainer extends Component {
  constructor(props){
    super(props);
    this.state = {
      amount: null,
      paymentID: 0,
    };
  }

  render() {
    return (
      <View >
        <HearderNavi title={i18n.TOP_UP}></HearderNavi>
        {this._renderContent()}
      </View>
    );
  }
  _renderContent(){
    return(
      <View style={styles.container}>
        <View style={styles.textView}>
          <Text style={styles.text}>{i18n.AMOUNT}</Text>
        </View>
        <View style={styles.amountView}>
          {
            amountDataOne.map((data,index)=>
              <TouchableOpacity key={index} style={[styles.amount,this.state.amount === data.text && {backgroundColor: 'rgb(115,143,254)'}]} onPress={this._onAmount.bind(this,data.text)}>
                <Text style={[styles.amountText,this.state.amount === data.text && {color: 'rgb(255,255,255)'}]}>{data.text}</Text>
              </TouchableOpacity>
            )
          }
        </View>
        <View style={styles.amountView}>
          {
            amountDataTwo.map((data,index)=>
              <TouchableOpacity key={index} style={[styles.amount,this.state.amount === data.text && {backgroundColor: 'rgb(115,143,254)'}]} onPress={this._onAmount.bind(this,data.text)}>
                <Text style={[styles.amountText,this.state.amount === data.text && {color: 'rgb(255,255,255)'}]}>{data.text}</Text>
              </TouchableOpacity>
            )
          }
        </View>

        <View style={styles.textView}>
          <Text style={styles.text}>{i18n.PAYMENT_METHOD}</Text>
        </View>

        {
          paymentData.map((data,index)=>
            <TouchableOpacity key={index} style={styles.payBgView} onPress={this._onPayment.bind(this,data)}>
              <View style={[styles.payView, !index && {borderBottomColor: 'rgb(204,204,204)', borderBottomWidth: 0.5}]}>
                <View style={styles.titleView}>
                  <View style={[styles.iconView,{backgroundColor: data.bgColor}]}>
                    <ChargerIcons name={data.icon} size={26}  color={'rgb(255,255,255)'}/>
                  </View>
                  <Text style={styles.titleText}>{data.text}</Text>
                </View>
                <View style={[styles.radioView,data.id === this.state.paymentID ? {backgroundColor: 'rgb(115,143,254)'} : {borderColor: 'rgb(204,204,204)',borderWidth: 1.5}]}>
                  {
                    data.id === this.state.paymentID &&
                    <ChargerIcons name="icon_icon24" size={16}  color={'rgb(255,255,255)'}/>
                  }
                </View>
              </View>
            </TouchableOpacity>
          )
        }

        <TouchableOpacity style={styles.buttonView} onPress={this._onTopUpClick.bind(this)} disabled={!(this.state.amount && this.state.paymentID)}>
          <View style={styles.button}>
            <Text style={styles.buttonText}>{i18n.PAY_NOW + (this.state.amount ? ' ' + this.state.amount : '') }</Text>
          </View>
        </TouchableOpacity>
      </View>

    )
  }
  //点击Top up 按钮
  _onTopUpClick(){
    console.log('_onTopUpClick')
  }
  //点击common problem按钮
  _commonProblemsAction(){
    console.log('_commonProblemsAction')
  }

  _onAmount(amount){
    this.setState(
      {
        amount: amount
      }
    );
  }

  _onPayment(data){
    this.setState(
      {
        paymentID: data.id
      }
    );
  }
}

const {width,height} = Dimensions.get('window');

const amountDataOne = [
  {
    text: 'HK$10',
    amount: 10,
  },
  {
    text: 'HK$20',
    amount: 20,
  },
  {
    text: 'HK$30',
    amount: 30,
  }
];

const amountDataTwo = [
  {
    text: 'HK$50',
    amount: 50,
  },
  {
    text: 'HK$100',
    amount: 100,
  },
  {
    text: 'HK$200',
    amount: 200,
  }
];

const paymentData = [
  {
    text: i18n.ALIPAY,
    icon: 'icon_icon23',
    bgColor: 'rgb(112,199,255)',
    id: 1
  },
  {
    text: i18n.WECHAT_PAY,
    icon: 'icon_icon22',
    bgColor: 'rgb(116,209,80)',
    id: 2
  }
];
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: 'white',
    flexDirection: 'column',
    marginTop:64,
  },
  textView: {
    width: width,
    height: 45,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  text: {
    marginLeft: 14,
    fontSize: 15,
    color: 'rgb(102,102,102)'
  },
  amountView: {
    width: width,
    height: 50,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'flex-start'
  },
  amount: {
    width: 105,
    height: 50,
    marginLeft: 15,
    borderWidth: 1,
    borderColor: 'rgb(115,143,254)',
    borderRadius: 2,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  amountText: {
    fontSize: 17,
    color: 'rgb(115,143,254)'
  },
  buttonView:{
    flex: 1,
    flexDirection: 'row',
    marginTop: 40,
    marginLeft: 15,
    marginRight: 15
  },
  payBgView: {
    width: width,
    backgroundColor: 'rgb(246,246,246)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  payView: {
    flex: 1,
    height: 60,
    marginLeft: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  titleView: {
    width: 100,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  iconView: {
    height: 30,
    width: 30,
    borderRadius: 2,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  titleText: {
    marginLeft: 17,
    fontSize: 14,
    color: 'rgb(51,51,51)'
  },
  radioView: {
    height: 26,
    width: 26,
    borderRadius: 13,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 30
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
});


TopUpContainer.propTypes = {
  dispatch: PropTypes.func
};


function mapStateToProps(state){
  return {};
};

module.exports = connect(mapStateToProps)(TopUpContainer);
