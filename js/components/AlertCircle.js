/**
 * Created by syl on 16/8/30.
 */
import React,{Component, PropTypes} from 'react';
import {Easing,Animated,View, StyleSheet,Text, Dimensions, TouchableOpacity,Image} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import WaterWaveView from './WaterWave'

const {height, width} = Dimensions.get('window');
const {heightScale,widthScale} = {heightScale: height / 667 , widthScale: width / 375};

export default class AlertCircle extends Component {
    constructor(props) {
        super(props);
        this.state = {
            Anim: new Animated.Value(0),
            isStartDisabled: false,
            isRotate: false,
            percent: 0.0
        }
    }
    componentDidMount() {
        if (this.state.isRotate){
            this.startAnimation();
        }
        this.setState({
            isStartDisabled: false
        });
    }

    componentDidUpdate() {
        if (this.props.chargingStatus && this.props.chargingStatus.cost ){
            const percent = Number((this.props.chargingStatus.cost / 100).toFixed(2));
            if (percent > this.state.percent && percent < 1.0){
                this.setState({
                    percent: percent
                });
            }else if (percent >= 1.0 && this.state.percent != 1.0){
                this.setState({
                    percent: 1.0
                });
            }
        }

    }
    startAnimation(){
        this.state.Anim.setValue(0);
        Animated.timing(
            this.state.Anim,
            {toValue: 1,
                duration:3000,
                easing:Easing.linear
            },
        ).start(()=>this.startAnimation());
    }
    render(){
        return(
            <View style={styles.container}>
                {this.props.start ? this._renderStartContent() : this.state.isRotate ? this._renderRotateContent() : this._renderWaterContent()}

            </View>
        )
    }

    _renderStartContent(){
        return(
          <LinearGradient start={[0.0, 1.0]} end={[0.0, 0.0]} locations={[0.0,0.5,1.0]} colors={['rgb(115,143,254)', 'rgb(115,143,254)', 'rgb(115,143,254)']}
                          style={styles.bigSircle}>
              <TouchableOpacity  onPress={this._onStartClick.bind(this)} disabled={this.state.isStartDisabled}>
                  <Image style={styles.smallSircle} source={require("../assets/images/smallSircle.png")}>
                    <Text style={styles.middleView}>{this.props.start}</Text>
                  </Image>
              </TouchableOpacity>
          </LinearGradient>
        )
    }

    _renderRotateContent(){
        return(
          <View style={styles.container}>
              <Animated.Image style={{
                  width:0.525*width,
                  height:0.525*width,
                  borderRadius:0.2625*width,
                  flexDirection: 'column',
                  justifyContent:'center',
                  alignItems:'center',
                  transform:[{
                      rotate:this.state.Anim.interpolate({
                          inputRange:[0,1],
                          outputRange:['0deg','360deg'],
                      })
                  }]
              }} source={this.props.imageSource}>
              </Animated.Image>
              <View style={styles.bgView}>
                  <LinearGradient start={[0.0, 1.0]} end={[0.0, 0.0]} locations={[0.0,0.5,1.0]} colors={['rgb(97,128,254)', 'rgb(118,145,254)', 'rgb(138,162,254)']}
                                  style={styles.startSircle}>
                      <View style={styles.context}>
                          <View style={styles.upView}>
                              <Text style={styles.upText}>{this.props.chargedPowerText}</Text>
                              <Text style={styles.downText}>{this.props.chargedPowerValue}</Text>
                          </View>

                          <View style={styles.downView}>
                              <Text style={styles.upText}>{this.props.durationText}</Text>
                              <Text style={styles.downText}>{this.props.durationValue}</Text>
                          </View>
                      </View>
                  </LinearGradient>
              </View>
          </View>
        )
    }

    _renderWaterContent(){
        return(
        <View style={styles.waterBgView}>
          <View style={styles.waterView}>
              <View style={styles.waterSircle}>
                  <WaterWaveView style={styles.waterWave} percent={this.state.percent}>
                      <Image style={styles.imageView} source={require("../assets/images/waterWave.png")}>
                          <View style={styles.percentView}>
                              <Text style={styles.percentText}>{ Math.round(this.state.percent && this.state.percent * 100)}</Text>
                              <Text style={styles.unitText}>{'%'}</Text>
                          </View>

                          {
                              this.props.chargingStatus &&
                              <View style={styles.feeView}>
                                  <Text style={styles.feeText}>{"HK$" + (this.props.chargingStatus ? this.props.chargingStatus.cost.toFixed(2) : "0")}</Text>
                              </View>
                          }
                    </Image>
                  </WaterWaveView>
              </View>
          </View>
        </View>
        )
    }

    _onStartClick(){

        this.setState({
            isStartDisabled: true
        });
        this.props.onStartClick();
    }

    _addPercent(){
        if (this.state.percent >= 0.9){
            num = -0.1;
        }
        if (this.state.percent <= 0.1){
            num = 0.1;
        }
        this.setState({
            percent: this.state.percent + num
        });
    }
}

let num = 0.1;

AlertCircle.propTypes = {
    start:PropTypes.string,
    chargedPowerText:PropTypes.string,
    chargedPowerValue:PropTypes.string,
    durationText:PropTypes.string,
    durationValue:PropTypes.string,
    onStartClick:PropTypes.func,
    imageSource:PropTypes.number
}

const styles=StyleSheet.create({
    container:{
        flex: 1,
        flexDirection: 'column',
        justifyContent:'center',
        alignItems:'center',
    },
    bigSircle:{
        width: 150 * widthScale,
        height: 150 * widthScale,
        borderRadius: 75 * widthScale,
        backgroundColor:"#7592FB",
        shadowColor:'rgb(0,0,0)',
        shadowOpacity: 0.2,
        shadowRadius: 2,
        shadowOffset:{
            height:0.5
        },
        marginTop: 10 * heightScale,
        marginBottom: 30 * heightScale,
        flexDirection: 'column',
        justifyContent:'center',
        alignItems:'center',
    },
    smallSircle:{
        width:134 * widthScale,
        height:134 * heightScale,
        flexDirection:'column',
        justifyContent:'center',
        alignItems:'center'
    },
    bgView:{
        width:0.39*width,
        height:0.39*width,
        borderRadius:0.195*width,
        backgroundColor:"rgb(255,255,255)",
        flexDirection:'column',
        marginTop:-0.46*width,
        justifyContent:'center',
        alignItems:'center',
        shadowColor:'rgba(184,195,253,0.50)',
        shadowOpacity: 10,
        shadowRadius: 10,
        shadowOffset:{
            height:0.5
        },
        marginBottom: 30 * heightScale
    },
    startSircle:{
        width:136 * widthScale,
        height:136 * widthScale,
        borderRadius:68 * widthScale,
        flexDirection:'column',
        justifyContent:'center',
        alignItems:'center',
        shadowColor:'rgb(184,195,253)',
        shadowOpacity: 0.4,
        shadowRadius: 10,
        shadowOffset:{
            height:0.5
        }
    },
    waterBgView:{
        marginTop:10 * heightScale,
        width:170 * widthScale,
        height:170 * widthScale,
        borderRadius:85 * widthScale,
        backgroundColor:"rgb(255,255,255)",
        flexDirection:'column',
        justifyContent:'center',
        alignItems:'center',
        shadowColor:'rgb(228,229,247)',
        shadowOpacity: 10,
        shadowRadius: 10,
        shadowOffset:{
            height:0.5
        },
        marginBottom: 10 * heightScale
    },
    waterView:{
        width:150 * widthScale,
        height:150 * widthScale,
        borderRadius:75 * widthScale,
        backgroundColor:"rgb(255,255,255)",
        flexDirection:'column',
        justifyContent:'center',
        alignItems:'center',
        shadowColor:'rgba(184,195,253,0.50)',
        shadowOpacity: 10,
        shadowRadius: 8,
        shadowOffset:{
            height:0.5
        }
    },
    waterSircle:{
        width:140 * widthScale,
        height:140 * widthScale,
        borderRadius:70 * widthScale,
        flexDirection:'column',
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:"rgb(190,203,254)",
        shadowColor:'rgb(184,195,253)',
        shadowOpacity: 1,
        shadowRadius: 1,
        shadowOffset:{
            height:0.5
        }

    },
    waterWave: {
        width: 142 * widthScale,
        height: 142 * widthScale,
        borderRadius:71 * widthScale,
        flexDirection:'column',
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:"rgb(190,203,254)"
    },
    imageView: {
        width: 140 * widthScale,
        height: 140 * widthScale,
        flexDirection:'column',
        justifyContent:'center',
        alignItems:'center',
    },
    percentView: {
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
        backgroundColor: 'rgba(0,0,0,0)'
    },
    percentText: {
        fontSize: 35,
        color: 'white'
    },
    unitText: {
        marginTop:8 * heightScale,
        fontSize: 20,
        color: 'white'
    },
    feeView: {
        marginTop: 10 * heightScale,
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
        backgroundColor: 'rgba(0,0,0,0)'
    },
    feeText: {
        fontSize: 16,
        color: 'white'
    },
    context:{
        flexDirection:'column',
        justifyContent:'space-between',
        alignItems:'center',
        backgroundColor: 'rgba(0,0,0,0)'
    },
    upView:{
         marginTop: 10 * heightScale

    },
    middleView:{
        fontSize:20,
        color:'white',
        textAlign:'center',
        backgroundColor: 'rgba(0,0,0,0)'
    },
    downView:{
         marginTop: 20 * heightScale
    },
    upText:{
        fontSize:11,
        color:'white',
        textAlign:'center'
    },
    downText:{
        fontSize:16,
        color:'white',
        textAlign:'center'
    }
});