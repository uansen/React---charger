/**
 * Created by syl on 16/9/1.
 */
import React,{Component,PropTypes} from 'react';
import { StyleSheet,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    VibrationIOS,Dimensions,TouchableHighlight,TouchableWithoutFeedback,Animated,Image} from 'react-native';
import Camera from 'react-native-camera';
import {Actions} from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/Ionicons';
import ChargerIcon from '../../utils/chargerIcons';
import i18n from '../../utils/i18n';

const dismissKeyboard = require('dismissKeyboard');

const { width,  height } = Dimensions.get('window');
const {heightScale,widthScale} = {heightScale: height / 667 , widthScale: width / 375};

const SQUARE_DIMENSIONS = 30;
const lineHeight = 40 * heightScale

class QRCodeScreen extends Component
{
    constructor(props){
        super(props);
        this.state = {
            cancelButtonVisible: true,
            cancelButtonTitle: 'Cancel',
            isScan: true,
            pan: new Animated.ValueXY(),
            chargeCode: "8b36cf10-74b4-4f53-be3e-49606e58dddd",
            isConfirmDisabled: false
        }

    }

    _onPressCancel() {
        Actions.pop();
    }

    _onBarCodeRead(result) {
        if (this.barCodeFlag) {
            this.barCodeFlag = false;
                VibrationIOS.vibrate();
                this.props.onSuccess(result.data);
        }
    }
    _onBarCodeWrite() {
        this.setState({
            isConfirmDisabled: true
        });
        if (this.state.chargeCode) {
            this.props.onSuccess(this.state.chargeCode);
        }
    }

    componentDidMount() {
        this._startAnimation();
    }

    _startAnimation() {
        Animated.sequence([
            Animated.timing(this.state.pan, {
                duration: 2000,
                toValue: {x: 0, y: 240 * heightScale}

            }),
            Animated.timing(this.state.pan, {
                duration: 1,
                toValue: {x: 0, y: 0}

            })
        ]).start(() => this._startAnimation());
    }

    render() {
        this.barCodeFlag = true;
        return (
          <TouchableWithoutFeedback onPress={()=> dismissKeyboard()}>
            <Camera onBarCodeRead={this._onBarCodeRead.bind(this)} style={styles.camera}>
                {this._renderBackIcon()}
                {this.state.isScan ? this._renderScanView() : this._renderFillView()}
            </Camera>
          </TouchableWithoutFeedback>
        );
    }

    _renderBackIcon(){
        return(
          <View style={styles.backView}>
              <TouchableOpacity style={styles.backIcon} underlayColor='#cccccc' onPress={this._onBackIconClick.bind(this)}>
                  <Icon name="ios-arrow-back" size={30}
                        color="white"
                        backgroundColor="transparent"
                  />
              </TouchableOpacity>
          </View>

        )
    }

    _renderRectangle(){
        return(
          <View style={styles.rectangleView}>
              <View style={styles.rectangleLeftView}/>
              <View style={styles.rectangle}>
                  <View style={styles.rectangle} >
                      <View style={styles.rectangleTop}>
                          <View style={styles.rectangleTopLine} />
                          <View style={styles.rectangleRightLine} />
                      </View>
                      <View style={styles.rectangleBottom}>
                          <View style={styles.rectangleLeftLine} />
                          <View style={styles.rectangleBottomLine} />
                      </View>
                  </View>
                  <Animated.Image style={[styles.image, {
                      transform: this.state.pan.getTranslateTransform()
                  }]} source={require('../../assets/images/qr_scan_line.png')} />

              </View>
              <View style={styles.rectangleRightView}/>
          </View>

        )
    }
    _renderScanView(){
        return(
          <View style={styles.content}>
              <View style={styles.rectangleContainer}>
                  {this._renderRectangle()}
              </View>
              <View style={styles.changeView}>
                  <Text style={styles.tipsText}>{i18n.CHARGE_QR_HINT}</Text>
                  <TouchableWithoutFeedback style={styles.changeButton} underlayColor='#cccccc' onPress={this._onChangeNumber.bind(this)}>
                      <View style={styles.changeNumberView}>
                          <ChargerIcon style={styles.changeNumberIcon} name="icon_iconfont-12"
                                       size={30} />
                      </View>
                  </TouchableWithoutFeedback>
                  <Text style={styles.changeNumberTips}>{i18n.ENTER_CHARGER}</Text>
              </View>

          </View>
        )
    }

    _renderFillView(){
        return(
          <View style={styles.inputContent}>
              <View style={styles.inputView}>
                  <TextInput style={styles.input} onChangeText={Text => this.state.chargeCode} value={this.state.chargeCode}/>
              </View>
              <Text style={styles.tipsText}>{i18n.CHARGE_CODE_HINT}</Text>
              <TouchableOpacity style={styles.button} onPress={this._onBarCodeWrite.bind(this)} disabled={this.state.isConfirmDisabled}>
                  <View style={styles.buttonView}>
                      <Text style={styles.buttonText}>{i18n.CONFIRM_BUTTON}</Text>
                  </View>
              </TouchableOpacity>

              <TouchableWithoutFeedback style={styles.changeButton} underlayColor='#cccccc' onPress={this._onChangeNumber.bind(this)}>
                  <View style={styles.changeNumberView}>
                      <ChargerIcon style={styles.changeNumberIcon} name="icon_iconfont-11"
                                   size={30} />
                  </View>
              </TouchableWithoutFeedback>
              <Text style={styles.changeNumberTips}>{i18n.SCAN_QR_CODE}</Text>
          </View>
        )
    }

    _onBackIconClick(){
        Actions.pop();
    }

    _onChangeNumber(){
        this.setState({
            isScan: !this.state.isScan,
            isConfirmDisabled: false
        });
    }
};
QRCodeScreen.propTypes={
    cancelButtonVisible: PropTypes.bool,
    cancelButtonTitle: PropTypes.string,
    onSuccess: PropTypes.func,
    onCancel: PropTypes.func
}

const styles = StyleSheet.create({

    camera: {
        height:height,
        width:width,
        alignItems: 'center',
        // backgroundColor: 'white',
    },
    content: {
        height:height,
        width:width,
        alignItems: 'center'
    },
    inputContent: {
        height:height,
        width:width,
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.3)'
    },
    backView: {
        // marginTop: 20,
        width:width,
        height: 140 * heightScale,
        backgroundColor: 'rgba(0,0,0,0.3)'
    },
    backIcon: {
        marginTop: 10 * heightScale,
        marginLeft: 10 * widthScale,
        width: 40 * widthScale,
        height: 40 * widthScale,
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius:20 * widthScale,
        flexDirection: 'column',
        justifyContent: 'center'
    },
    rectangleContainer: {
        alignItems: 'center'
    },
    rectangleView: {
        height: 252 * heightScale,
        width: width,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    rectangleLeftView: {
        height: 252 * heightScale,
        width: (width - 252) * 0.5 * widthScale,
        backgroundColor: 'rgba(0,0,0,0.3)'
    },
    rectangleRightView: {
        marginLeft: 2 * widthScale,
        height: 252 * heightScale,
        width: (width - 252) * 0.5 * widthScale,
        backgroundColor: 'rgba(0,0,0,0.3)'
    },
    rectangle: {
        height: 250 * heightScale,
        width: 250 * widthScale,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0)',
        backgroundColor: 'transparent',
        flexDirection: 'column',
        justifyContent: 'space-between'
    },
    image: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        top: 0,
        width: 250 * widthScale,
        height: 5 * heightScale
    },
    rectangleTop: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    rectangleBottom: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    rectangleTopLine: {
        height: lineHeight,
        width: lineHeight,
        borderTopWidth: 2,
        borderTopColor: '#ffffff',
        borderLeftWidth: 2,
        borderLeftColor: '#ffffff',
        margin: -2 * widthScale
    },
    rectangleBottomLine: {
        height: lineHeight,
        width: lineHeight,
        borderBottomWidth: 2,
        borderBottomColor: '#ffffff',
        borderRightWidth: 2,
        borderRightColor: '#ffffff',
        margin: -2 * widthScale
    },
    rectangleLeftLine: {
        height: lineHeight,
        width: lineHeight,
        borderBottomWidth: 2 ,
        borderBottomColor: '#ffffff',
        borderLeftWidth: 2,
        borderLeftColor: '#ffffff',
        margin: -2 * widthScale
    },
    rectangleRightLine: {
        height: lineHeight,
        width: lineHeight,
        borderTopWidth: 2,
        borderTopColor: '#ffffff',
        borderRightWidth: 2,
        borderRightColor: '#ffffff',
        margin: -2 * widthScale
    },
    changeView: {
        width: width,
        height: 500 * heightScale,
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    changeNumberView: {
        marginTop: 90 * heightScale,
        height: 50 * widthScale,
        width: 50 * widthScale,
        borderColor: '#ffffff',
        borderWidth: 1,
        borderRadius: 25 * widthScale,
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center'
    },
    changeNumberIcon: {
        //marginLeft: 6,
        color: '#ffffff',
        backgroundColor: 'rgba(0,0,0,0)'
    },
    tipsText: {
        marginTop: 10 * heightScale,
        fontSize: 14,
        color: 'rgba(255,255,255,0.6)',
        backgroundColor: 'rgba(0,0,0,0)'
    },
    changeNumberTips: {
        marginTop: 15 * heightScale,
        fontSize: 16,
        color: '#ffffff',
        backgroundColor: 'rgba(0,0,0,0)'
    },
    inputView: {
        height: 40 * heightScale,
        flexDirection: 'row',
        justifyContent: 'center',
        borderColor: '#ffffff',
        borderRadius: 2,
        borderWidth: 1,
        marginTop: 110 * heightScale,
        marginLeft: 40 * widthScale,
        marginRight: 40 * widthScale,
    },
    input: {
        flex: 1,
        color: '#ffffff',
        fontSize: 14
    },
    button: {
        marginTop: 30 * heightScale,
        marginLeft: 40 * widthScale,
        marginRight: 40 * widthScale,
        marginBottom: 32 * heightScale,
        flexDirection: 'row',
        justifyContent: 'center',
        borderColor: '#265a8f',
        backgroundColor: 'rgba(91,124,254,1.0)',
        borderRadius: 2,
        height: 40 * heightScale
    },
    buttonView: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center'
    },
    buttonText: {
        textAlign: 'center',
        color: '#ffffff',
        fontSize: 16
    }

});

module.exports = QRCodeScreen;