/**
 * Created by syl on 16/9/5.
 */
import  React, {Component,PropTypes} from 'react';
import {View, Text, PanResponder, StyleSheet, Dimensions,Animated} from 'react-native';
import i18n from '../utils/i18n';

const {width, height} = Dimensions.get('window');
const {heightScale,widthScale} = {heightScale: height / 667 , widthScale: width / 375};

 export default class  CustomSlider extends Component {
    constructor(props){
        super(props);
        this.state = {
            top:0,
            left:0,
            sliderWidth: 240 * widthScale,
            initialX: 0,
            locationX: 0,
            dx: 0,
            animatedX: new Animated.Value(0),
            released: false,
            swiped: true,
            bgWidth: 60 * widthScale,
            textColor: 'rgb(153,153,153)'
        }
    }
    componentWillMount(){
        this._panResponder = PanResponder.create({
            onStartShouldSetPanResponder:()=>true,
            onMoveShouldSetPanResponder:()=>true,
            onPanResponderGrant:()=>{
                this._top = this.state.top
                this._left = this.state.left
                this._width = this.state.sliderWidth
                this.setState({bg:'red'})
            },
            onPanResponderMove:(evt,gs)=>{
                // console.log(gs.dx+''+gs.dy);

                if (gs.dx > this._left && gs.dx <= this._width){
                    this.setState({
                        top:this._top+gs.dy,
                        left:this._left + gs.dx,
                        bgWidth: gs.dx + 60 * widthScale,
                        // textColor: 'white'
                    })
                }
                if (gs.dx > 0.4 * this._width) {
                    this.setState({
                        textColor: 'white'
                    })
                }else {
                    this.setState({
                        textColor: 'rgb(153,153,153)'
                    })
                }
            },
            onPanResponderRelease:(evt,gs)=>{
                this.setState({
                    top:this._top+gs.dy,
                    left:this._left,
                    bgWidth: 60 * widthScale,
                    textColor: 'rgb(153,153,153)'
                })
                if (gs.dx > 0.8 * this._width) {
                    this.onSlideSuccess();
                }
            }

        })
    }
    render(){
        return(
            <View style={styles.container}>
                <View style={[styles.bgView,{width:this.state.bgWidth}]}></View>
                <Text style={[styles.text,{color: this.state.textColor}]}>{i18n.SLIDE_TO_STOP}</Text>
                <View{...this._panResponder.panHandlers} style={[styles.sliderView,{left:this.state.left}]}></View>

            </View>
        )
    }
     onSlideSuccess(){
         if(this.props.onSlideSuccess){
             this.props.onSlideSuccess();
         }
     }

}
CustomSlider.propTypes = {
    onSlideSuccess:PropTypes.func
}
const styles = StyleSheet.create({
    container: {
        width:0.8*width,
        height:40 * heightScale,
        borderRadius:25 * widthScale,
        marginBottom:20 * heightScale,
        borderColor:'rgb(204,204,204)',
        borderWidth:1,
        backgroundColor: 'rgba(249,249,249,0.5)'
    },
    text: {
        // color: 'rgb(153,153,153)',
        textAlign:"center",
        position:"relative",
        height:20 * heightScale,
        marginLeft:0.1*width,
        marginRight:0.1*width,
        marginTop:10 * heightScale,
        fontSize: 16
    },
    sliderView: {
        position:"absolute",
        borderWidth:1,
        borderColor:'rgb(204,204,204)',
        backgroundColor:"white",
        width:60 * widthScale,
        height:42 * heightScale,
        borderRadius:25 * widthScale,
        top:-2
    },
    bgView: {
        position:"absolute",
        height:38 * heightScale,
        borderRadius:25 * widthScale,
        backgroundColor: 'rgb(255,120,120)'
    }
})