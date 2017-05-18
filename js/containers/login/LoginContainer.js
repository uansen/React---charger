import React, {Component, PropTypes} from 'react';
import {AsyncStorage,StyleSheet, Text, TextInput, View,TouchableOpacity,TouchableWithoutFeedback,StatusBar,Image,DeviceEventEmitter,AlertIOS,Dimensions } from 'react-native';
import { connect } from 'react-redux';
import {Actions} from 'react-native-router-flux';
import IconFont from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient';
import {getVerificationCode,login,initUser} from '../../actions/loginAction';
import CountryPicker from 'react-native-country-picker-modal';
import Storage from 'react-native-storage';
import {setCurrentUserId} from '../../utils/service';
import ChargerIcon from '../../utils/chargerIcons';
import Icon from 'react-native-vector-icons/Ionicons';
import i18n from '../../utils/i18n';
import openShare from 'react-native-open-share';
import HudView from './HudView';

const dismissKeyboard = require('dismissKeyboard');
const {width,height} = Dimensions.get('window');
const {heightScale,widthScale} = {heightScale: height / 667 , widthScale: width / 375};

var codeTime = 60;

var storage = new Storage({
  // 最大容量，默认值1000条数据循环存储
  size: 1000,

  // 存储引擎：对于RN使用AsyncStorage，对于web使用window.localStorage
  // 如果不指定则数据只会保存在内存中，重启后即丢失
  storageBackend: AsyncStorage,

  // 数据过期时间，默认一整天（1000 * 3600 * 24 毫秒），设为null则永不过期
  defaultExpires: null,

  // 读写时在内存中缓存数据。默认启用。
  enableCache: true,

  // 如果storage中没有相应数据，或数据已过期，
  // 则会调用相应的sync同步方法，无缝返回最新数据。
  sync: {
    // 同步方法的具体说明会在后文提到
  }
})
global.storage = storage;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    paddingLeft: 40 * widthScale,
    paddingRight: 40 * widthScale,
    backgroundColor:'rgba(0, 0, 0, 0.1)'
  },
  logoWrapper: {
    height: 100 * heightScale,
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 70 * heightScale

  },
  logo: {
    marginTop: 15 * heightScale
  },
  logoText: {
    textAlign: 'center',
    fontSize: 18,
    color:'#ffffff',
    marginTop: 20 * heightScale,
    marginBottom: 30 * heightScale
  },
  countryView: {
    marginTop: 10 * heightScale,
    height: 42 * heightScale,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#ffffff'

  },
  codeView: {
    marginTop: 10 * heightScale,
    height: 42 * heightScale,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  countryText: {
    color: '#ffffff',
    textAlign: 'left',
    fontSize: 15
  },
  areaCodeView: {
    width: 60 * widthScale,
    height: 42 * heightScale,
    alignItems: 'center',
    justifyContent: 'center'
  },
  phoneView: {
    flex: 1,
    height: 35 * heightScale
},
  phoneInput: {
    height: 35 * heightScale,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'left',
    fontSize: 15
  },
  vCodeView: {
    width: 200 * widthScale,
    height: 42 * heightScale,
    borderBottomWidth: 1,
    borderBottomColor: '#ffffff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  codeInput: {
    width: 150 * widthScale,
    height: 35 * heightScale,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'left',
    fontSize: 15
  },
  sendView: {
    marginTop: 10 * heightScale,
    width: 80 * widthScale,
    height: 35 * heightScale,
    borderWidth: 1,
    borderRadius: 3 * widthScale,
    borderColor: '#ffffff',
    flexDirection: 'column',
    justifyContent: 'center'
  },
  sendText: {
    color:'#ffffff',
    textAlign: 'center',
    fontSize: 14
  },
  button: {
    marginTop: 40 * heightScale,
    borderColor: '#265a8f',
    backgroundColor: 'rgba(91,124,254,1.0)',
    borderRadius: 2 * widthScale,
    justifyContent: 'center',
    flexDirection: 'column',
    height: 45 * heightScale
  },
  buttonText: {
    textAlign: 'center',
    color: '#ffffff',
    fontSize: 15,
  },
  othersView: {
    alignItems: 'center',
    height: 30 * heightScale,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 65 * heightScale,
    marginLeft: 10 * widthScale,
    marginRight: 10 * widthScale
  },
  lineView: {
    backgroundColor: 'rgba(255,255,255,0.8)',
    height: 1 * heightScale,
    width: 100 * widthScale
  },
  orthersText: {
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    fontSize: 13
  },
  othersLogo: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10 * heightScale
  },
  otherLogoStyle: {
    borderColor: '#303E70',
    borderWidth: 1,
    width: 50 * widthScale,
    height: 50 * widthScale,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    borderRadius: 25 * widthScale,
    backgroundColor: '#303E70'
  },
  gradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0
  }
})

class LoginContainer extends Component {
  constructor(props){
    super(props);
    this.state = {
      timerCount:codeTime,
      timerTitle:i18n.LOGIN_CODE,
      disabled: false,
      tphone: '',
      countryName: 'China',
      areaCode: '86',
      authCode: null,
      cca2: 'CN'
    };
  }

  componentDidMount(){
    // 自动登录
    this._autoLogin();
  }

  render() {
    return (
      <LinearGradient start={[0.5, 0.0]} end={[0.9, 1.0]} locations={[0.0,0.4,1.0]} colors={['#2580B2', '#15447C', '#050745']}
                      style={styles.gradient}>
        <StatusBar backgroundColor="#ff0000" barStyle="light-content"/>
        <TouchableWithoutFeedback onPress={()=> dismissKeyboard()}>
          <View style={styles.container}  >
            <View style={styles.logoWrapper}>
              {/*<IconFont name="bolt" size={100} color="#ffffff" />*/}
              {/*<ChargerIcon style={styles.changeNumberIcon} name="icon_iconfont-17"*/}
                           {/*size={100} color="#ffffff"/>*/}
              <Image style={styles.logo} source={require("../../assets/images/charger@2x.png")}></Image>
            </View>
            <Text style={styles.logoText}>EV Charging</Text>
            <View><HudView ref="hudView" /></View>
            <View style={styles.countryView}>

              <Text style={styles.countryText} ref="codeText"  >
                { this.state.country ?  this.state.country.name  : this.state.countryName}
                {' +' }
                { this.state.country ?  this.state.country.callingCode  : this.state.areaCode }
              </Text>
              <CountryPicker
                onChange={(value)=> this.setState({country: value, cca2: value.cca2})}
                cca2={this.state.cca2}
                translation='chn'
                closeable={true}
              />

            </View>

            <View style={styles.countryView}>
              <View style={styles.phoneView}>
                <TextInput style={styles.phoneInput} onChangeText={text => this.setState({tphone: text})}
                           autoCapitalize="none" autoCorrect={false} keyboardType='numeric' maxLength={11}
                           placeholder={i18n.LOGIN_PHONE} placeholderTextColor="#ababaa" value={this.state.tphone} />
              </View>
              {
                this.state.tphone ?
                <TouchableOpacity onPress={this._clearPhone.bind(this)} >
                  <Icon name="ios-close-circle-outline" size={22} color="#ffffff" />
                </TouchableOpacity> : null
              }

            </View>

            <View style={styles.codeView}>
              <View style={styles.vCodeView}>
                <TextInput style={styles.codeInput} onChangeText={text => this.setState({authCode: text})}
                           autoCapitalize="none" autoCorrect={false} keyboardType='numeric' maxLength={6}
                           placeholder={i18n.LOGIN_VCODE} placeholderTextColor="#ababaa" value={this.state.authCode} />
                {
                  this.state.authCode ?
                    <TouchableOpacity onPress={this._clearAuthCode.bind(this)}>
                      <Icon name="ios-close-circle-outline" size={22} color="#ffffff" />
                    </TouchableOpacity> : null
                }
              </View>

              <TouchableOpacity style={styles.sendView} onPress={this._send.bind(this)} disabled={this.state.disabled} >
                <View>
                  <Text style={styles.sendText}> {this.state.disabled  ? this.state.timerCount + 's' : this.state.timerTitle} </Text>

                </View>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.button} onPress={this._handleLogin.bind(this)}>
              <View>
                <Text style={styles.buttonText}>{i18n.BUTTON_LOGIN}</Text>
              </View>
            </TouchableOpacity>

            <View style={styles.othersView}>
              <View style={styles.lineView}></View>

              <Text style={styles.orthersText}>{i18n.LOGIN_OTHERS}</Text>

              <View style={styles.lineView}></View>

            </View>

            <View style={styles.othersLogo}>
              <TouchableOpacity onPress={this._QQLogin.bind(this)}>
                <View style={styles.otherLogoStyle}>
                  <IconFont  name="facebook" size={30} color="rgba(255,255,255,0.8)"/>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={this._weiboLogin.bind(this)}>
                <View style={styles.otherLogoStyle}>
                  <IconFont  name="twitter" size={30} color="rgba(255,255,255,0.8)"/>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </LinearGradient>
    );
  }

  _QQLogin() {
    openShare.qqLogin();

    if(!this.qqLogin) {
      this.qqLogin = DeviceEventEmitter.addListener(
        'managerCallback',
        (response) => {
          AlertIOS.alert(
            'response',
            JSON.stringify(response)
          );

          this.qqLogin.remove();
          delete this.qqLogin;
        }
      );
    }
  }

  _wechatLogin(){
    openShare.wechatLogin();

    if(!this.wechatLogin) {
      this.wechatLogin = DeviceEventEmitter.addListener(
        'managerCallback',
        (response) => {
          AlertIOS.alert(
            'response',
            JSON.stringify(response)
          );

          this.wechatLogin.remove();
          delete this.wechatLogin;
        }
      );
    }
  }

  _weiboLogin(){
    openShare.weiboLogin();

    if(!this.weiboLogin) {
      this.weiboLogin = DeviceEventEmitter.addListener(
        'managerCallback',
        (response) => {
          AlertIOS.alert(
            'response',
            JSON.stringify(response)
          );

          this.weiboLogin.remove();
          delete this.weiboLogin;
        }
      );
    }
  }

  _autoLogin(){
    // 读取
    storage.load({
      key: 'autoUser',

      // autoSync(默认为true)意味着在没有找到数据或数据过期时自动调用相应的同步方法
      autoSync: true,

      // syncInBackground(默认为true)意味着如果数据过期，
      // 在调用同步方法的同时先返回已经过期的数据。
      // 设置为false的话，则始终强制返回同步方法提供的最新数据(当然会需要更多等待时间)。
      syncInBackground: true
    }).then(ret => {
      //如果找到数据，则在then方法中返回
      if (ret.mobile){
        console.log('@@@@@@ user : ' + ret.mobile);

        storage.load({
          key: ret.mobile,
          id: 'login',
          autoSync: true,
          syncInBackground: true
        }).then(ret => {
          if (ret.user){
            setCurrentUserId(ret.user.userId);
            this.props.dispatch(initUser(ret.user));
            Actions.main();
          }
        }).catch(err => {});

      }
    }).catch(err => {
      //如果没有找到数据且没有同步方法，
      //或者有其他异常，则在catch中返回
      //console.warn(err.message);
      switch (err.name) {
        case 'NotFoundError':
          // TODO;
          break;
        case 'ExpiredError':
          // TODO
          break;
      }
    })
  }

  _clearPhone(){
    this.setState({
      tphone: ''
    });
  }

  _clearAuthCode(){
    this.setState({
      authCode: null
    });
  }

  //获取验证码
  _send(){
    if (this.state.tphone){
      dismissKeyboard();

      this.countdownStart();

      var code = this.state.areaCode ;
      if (this.state.country){
        code = this.state.country.callingCode;
      }
      this.props.dispatch(getVerificationCode(this.state.tphone,code));
    }

  }

  //倒计时开始
  countdownStart() {
    this.interval = setInterval(() => {
        var timer = this.state.timerCount - 1

        if(timer === 0){
          this.interval && clearInterval(this.interval);

          this.setState({
            timerCount:codeTime,
            timerTitle:'Send',
            disabled: false

          });

        }else{

          this.setState({
            timerCount:timer,
            disabled: true
          });

        }

    }, 1000
    );
  }

  //登陆校验
  _handleLogin(){

    if (this.state.authCode){
      this.props.dispatch(login(this.state.tphone,this.state.areaCode,this.state.authCode));

    }else{
      var customComponent = (<Text style={{color: "#ffffff"}}>{i18n.LOGIN_CODE_HINT} </Text>);
      this.refs.hudView.showCustomComponent(customComponent,false,true);
    }
  }

  //获取数据并更新
  componentWillReceiveProps(nextProps) {
    //console.log('payload : '+ nextProps.payload);
    const prvIsLoggedIn = this.props.isLoggedin;
    const prvIsFetching = this.props.isFetching;
    const nextIsLoggedin = nextProps.isLoggedin;
    const nextIsFecthing = nextProps.isFetching;

    const errorMsg = nextProps.payload;
    const authCode = nextProps.authCode;
    const userId = nextProps.user.userId;

    if (!nextIsLoggedin && !nextIsFecthing){
      var customComponent;
      if (errorMsg === 'SEND_CODE_ERROR') {
        customComponent = (<Text style={{color: "#ffffff"}}> {i18n.LOGIN_CODE_FAILED} </Text>);
      }
      if (errorMsg === 'LOGIN_ERROR') {
        customComponent = (<Text style={{color: "#ffffff"}}> {i18n.LOGIN_CODE_ERRO} </Text>);
      }
      this.refs.hudView.showCustomComponent(customComponent, false, true);
    }

    //获取验证码
    if (!nextIsLoggedin && nextIsFecthing && authCode){
      this.setState({
        authCode: authCode,
      });
    }

    //登陆跳转
    if ( !prvIsLoggedIn && prvIsFetching
      && nextIsLoggedin && !nextIsFecthing
      && userId ){

      storage.save({
        key: 'autoUser',
        rawData: {
          mobile: nextProps.user.mobile,
        },
        // 如果设为null，则永不过期
        expires: null
      });

      storage.save({
        key: nextProps.user.mobile,
        id: 'login',
        rawData: {
          user: nextProps.user,
          orderStatus:nextProps.user.orderStatus,
        },

        // 如果设为null，则永不过期
        expires: null
      });

      Actions.main();

    }
  }

  //清除倒计时
  componentWillUnmount(){
    this.interval && clearInterval(this.interval);
  }

  //退出键盘
  containerTouched(event) {
    dismissKeyboard();
  };
}

LoginContainer.propTypes = {
  dispatch: PropTypes.func,
  history: PropTypes.any
};

function mapStateToProps(state){
  const login = state.get('login').toJSON();
  login.error =  state.getIn(['root', 'error']);
  return login;
};


module.exports = connect(mapStateToProps)(LoginContainer);
