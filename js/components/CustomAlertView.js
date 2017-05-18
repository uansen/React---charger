/**
 * Created by syl on 16/9/18.
 */
import React, {Component,PropTypes} from 'react';
import {NetInfo,View, StyleSheet, Dimensions,Alert,Text,TouchableHighlight,InteractionManager,TouchableOpacity,Modal} from 'react-native';
import AlertUpView from './AlertUpView';
import AlertCircle from './AlertCircle';
import CustomSlider from './CustomSlider';
import CustomBotomView from './CustomBotomView'
import SeparateLine from './SeparateLine'
import NetErrorView from './NetErrorView'
import {checkNet} from '../actions/networkAction'
import {hideError} from '../actions/connectorAction';
import StopCharge from './StopCharge'
import i18n from '../utils/i18n';
import HudView from '../containers/login/HudView';
import TextLabel from './TextLabel';

const {height,width} = Dimensions.get('window');
const {heightScale,widthScale} = {heightScale: height / 667 , widthScale: width / 375};

const styles = StyleSheet.create({
    container:{
        flexDirection:"column",
        height:0.6*height,
        width:width,
        backgroundColor:'white'
    },
    popStopCharge: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: -0.45*height,
        bottom: 0,
        backgroundColor:'rgba(0, 0, 0, 0.6)',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems:'center'
    },
    hubView: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 235 * heightScale
    },
    hudContainer: {
        justifyContent:"center",
        alignItems: "center",
        width:230 * widthScale,
        height:57 * heightScale,
        borderRadius: 5
    },
    feeView:{
        flexDirection:"row",
        justifyContent:"center",
        alignItems:'center',
    },
    content: {
        width: width * 0.3,
        flexDirection:'column',
        justifyContent:'center',
        alignItems:'center'
    },
    normal: {
        marginTop: 20 * heightScale,
        flexDirection:'column',
        justifyContent:'center',
        alignItems:'center'
    },
    sliderView: {
        height: 50 * heightScale,
        marginTop: 20 * heightScale,
        marginBottom: 30 * heightScale,
        flexDirection:'column',
        justifyContent:'center',
        alignItems:'center'
    }
})
export default class CustomAlertView extends Component {
    constructor(props){
        super(props);
        this.state = {
            isConnect:true,
            isStopCharge: false
        }
    }

    componentDidMount() {
        if (this.props.detailInfo && !this.props.orderId && !this.props.chargingStatus){
            var customComponent = (<Text style={{color: "#ffffff"}}>{'Please insert the charging pile \n   Click start charging again'} </Text>);
            this.refs.hudView.showCustomComponent(customComponent,false,true);
        }
    }
    componentWillReceiveProps(nextProps) {
        if (this.props.isFetching && !nextProps.isFetching && nextProps.error && !this.props.error) {
            Alert.alert('Tip',
                nextProps.error.msg
            );
            // setTimeout(() => {
            //     this.props.dispatch(hideError())
            // }, 1000);
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <AlertUpView title={((this.props.detailInfo && this.props.orderId)|| this.props.orderStatus === 1 ) ? i18n.CHARGING : i18n.MAP_CONNECTED}
                             leftText={(this.props.detailInfo && this.props.detailInfo.type === "1") ? i18n.ACCHARGER : i18n.DCCHARGER}
                             rightText={i18n.CURRENT + ((this.props.detailInfo && this.props.detailInfo.ratedCurrent)  ? this.props.detailInfo.ratedCurrent  : 0) + "A"}
                             isShowNotice={this.props.chargingStatus} />

                {this._renderNormalDownView()}
                {this.state.isStopCharge ? this._renderStop() : null}
                <HudView style={styles.hubView} ref="hudView" hudContainer={styles.hudContainer} fadeDuration={4000}/>
            </View>
        )
    }
    _renderNormalDownView(){
        if (this.state.isConnect){
            return(
                <View style={styles.normal}>
                    {this._renderSircle()}
                    {this._renderSeperater()}
                    {this._renderDownView()}
                </View>
            )
        }else {
            return(
                <View>
                    {this._renderNetErrorView()}
                </View>
            )
        }
    }

    _renderSircle() {
        if (this.props.orderId || this.props.chargingStatus) {
            return (
                <AlertCircle
                    imageSource={require('../assets/images/round@2x.png')}
                    chargedPowerText={i18n.CHARGED_POWER}
                    chargedPowerValue={(this.props.chargingStatus ? this.props.chargingStatus.prod.toFixed(1) : "0") + 'kWh'}
                    durationText={i18n.DURATION}
                    durationValue={(this.props.chargingStatus ? (this.props.chargingStatus.duration / 60).toFixed(1) : "0") + 'min'}
                    chargingStatus = {this.props.chargingStatus ? this.props.chargingStatus : null}
                />
            )
        } else if ((this.props.detailInfo && !this.props.orderId)) {
            return (
                <AlertCircle
                    start={i18n.START} onStartClick={this._onClick.bind(this)}
                />
            )
        } else if (this.props.checkoutInfo) {
            return (
                <AlertCircle
                    chargedPowerText={i18n.CHARGED_POWER}
                    chargedPowerValue={(this.props.chargingStatus ? this.props.chargingStatus.prod.toFixed(1) : "0") + 'kWh'}
                    durationText={i18n.DURATION}
                    durationValue={(this.props.chargingStatus ? (this.props.chargingStatus.duration / 60).toFixed(1) : "0") + 'min'}
                    chargingStatus = {this.props.chargingStatus ? this.props.chargingStatus : null}
                />
            )
        }
    }

    _renderSeperater() {
        if (this.props.orderId || this.props.chargingStatus) {
            return (
                <View>
                    <Text style={{
                        color: "black",
                        fontSize: 16,
                        textAlign: "center",
                        marginTop: 10 * heightScale
                    }}>{"HK$" + (this.props.chargingStatus ? this.props.chargingStatus.cost.toFixed(2) : "0")}</Text>
                </View>
            )
        } else if ((this.props.detailInfo && !this.props.orderId)) {
            return (
              <View>
                <View style={{marginTop: -15 * heightScale,marginBottom: 20 * heightScale}}>
                    <TouchableOpacity onPress={this._onHideAlert.bind(this)}>
                        <View style={{height: 20 * heightScale,flexDirection: 'column', flex:1,justifyContent: 'center'}}>
                            <Text style={{color: "rgb(115,143,254)", textAlign: "center",fontSize:15}}>{i18n.DISCONNECT}</Text>
                        </View>

                    </TouchableOpacity>
                </View>
                <SeparateLine />
              </View>
            )
        }else {
            <View style={styles.feeView}>
                <TextLabel style={styles.content} title={i18n.DURATION} value={'HK$ ' + ((this.props.detailInfo && this.props.detailInfo.accessFee)
                  ? this.props.detailInfo.accessFee : 'N/A')}/>
                <TextLabel style={styles.content} title={i18n.CHARGED_POWER} value={'HK$ '+ ((this.props.detailInfo &&
                this.props.detailInfo.connectionFee) ? this.props.detailInfo.connectionFee : 'N/A')+"/min"}/>
                <TextLabel style={styles.content} title={i18n.DRIVING} value={'HK$ '+ ((this.props.detailInfo &&
                this.props.detailInfo.connectionFee) ? this.props.detailInfo.connectionFee : 'N/A')+"/min"}/>
            </View>
        }
    }

    _renderDownView() {
        if (this.props.orderId || this.props.chargingStatus) {
            return (
                <View style={styles.sliderView}>
                    <CustomSlider onSlideSuccess={this._onDisconnect.bind(this)}>
                        <View style={{height: 50 * heightScale, width: 500 * heightScale}}>
                            <Text>Slide Button</Text>
                        </View>
                    </CustomSlider>
                </View>
            )
        } else if ((this.props.detailInfo && !this.props.orderId)) {
            return (
              <View>
                  <CustomBotomView detailInfo={this.props.detailInfo ? this.props.detailInfo : null}/>
              </View>

            )
        }
    }

    _renderNetErrorView() {
        return (
            <NetErrorView />
        )
    }

    _renderStop(){
        return(
          <TouchableOpacity style={styles.popStopCharge}  onPress={()=> this._onHideStopCharge()} >
              <StopCharge chargingStatus={this.props.chargingStatus} onCallback={this._onOkStop.bind(this)} />

          </TouchableOpacity>
        );
    }
    _onDisconnect() {
        // Alert.alert('Tip', "sure to stop charge", [{text: 'ok', onPress: ()=>this._onOkStop()},
        //     {text: 'cancel', onPress: ()=>this._onCancel()}]);
        this.setState({
            isStopCharge: true
        });
    }

    _onHideStopCharge(){
        this.setState({
            isStopCharge: false
        });
    }

    _onClick() {
        if(this.props.onClick){
            this.props.onClick();
        }

    }

    _onHideAlert() {
        if (this.props.onHideAlert) {
            this.props.onHideAlert();
        }

    }

    _onOkStop() {
        if(this.props.onOkStrop){
            this.props.onOkStrop();
        }
    }

}
CustomAlertView.propTypes = {
    dispatch: PropTypes.func,
    detailInfo:PropTypes.object,
    isFetching: PropTypes.bool,
    error:PropTypes.object,
    orderId:PropTypes.string,
    chargingStatus:PropTypes.object,
    onHideAlert:PropTypes.func,
    isOpen:PropTypes.bool,
    checkoutInfo:PropTypes.object,
    onClick:PropTypes.func,
    onOkStrop:PropTypes.func,
    orderStatus:PropTypes.number

}


