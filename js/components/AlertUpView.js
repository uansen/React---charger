/**
 * Created by syl on 16/8/29.
 */
import React, {Component,PropTypes} from 'react';
import {Text, Dimensions, StyleSheet, View,TouchableHighlight,Modal,TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import ChargerIcon from '../utils/chargerIcons';
import ChargeNotice from '../containers/charge/ChargeNotice'

const {height,width} = Dimensions.get('window');
const {heightScale,widthScale} = {heightScale: height / 667 , widthScale: width / 375};

export default class AlertUpView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isShowChargeNotice: false,
        };
    }
    render(){
        return(
            <View style={styles.container}>
                <View style={styles.titleView}>
                    <Text style={styles.upView}>{this.props.title}</Text>
                    {
                        !this.props.isShowNotice &&
                        <TouchableOpacity onPress={this._showChargeNotice.bind(this)}>
                            <ChargerIcon style={styles.icon} name="icon_iconfont-09" size={20} />
                        </TouchableOpacity>
                    }

                </View>
                <View style={styles.downView}>
                    <View style={styles.contentView}>
                        <View style={{width: 4,height: 4,borderRadius:2 ,backgroundColor:'gray'}} />
                        <Text style={{color:'gray', fontSize:13, textAlign:'center',marginLeft: 5}} >{this.props.leftText}</Text>
                    </View>
                    <View style={styles.contentView}>
                        <View style={{width: 4,height: 4,borderRadius:2 ,backgroundColor:'gray'}} />
                        <Text style={{color:'gray', fontSize:13, textAlign:'center',marginLeft: 5}} >{this.props.rightText}</Text>
                    </View>

                </View>
                {this._renderChargeNotice()}
            </View>
        )
    }

    _renderChargeNotice(){
        return (
          <Modal animationType="slide" visible={this.state.isShowChargeNotice} transparent >
              <TouchableOpacity style={styles.popChargeNotice} onPress={()=> this._hideChargeNotice.bind(this)} >
                  <View>
                      <ChargeNotice onCallback={this._hideChargeNotice.bind(this)}/>
                  </View>

              </TouchableOpacity>
          </Modal>
        );
    }

    _showChargeNotice(){
        this.setState({
            isShowChargeNotice: true
        });
    }

    _hideChargeNotice(){
        this.setState({
            isShowChargeNotice: false
        });
    }

}
const styles = StyleSheet.create({
    container:{
        height:60 * heightScale,
        flexDirection:'column',
        justifyContent:'center',
        alignItems:'center'
    },
    titleView: {
        marginTop: 15 * heightScale,
        flexDirection:'row',
    },
    icon: {
        margin: 4 * widthScale,
        color: 'rgb(115,143,254)',
        backgroundColor:"#ffffff"
    },
    upView:{
        marginTop: 5 * heightScale,
        color:'black',
        textAlign:'center',
        fontSize:18
    },
    downView:{
        marginTop: 10 * heightScale,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    leftView:{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    contentView:{
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    popChargeNotice: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        top:0,
        backgroundColor:'rgba(0, 0, 0, 0.8)',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems:'center'
    }
})
AlertUpView.propTypes = {
    title:PropTypes.string,
    leftText:PropTypes.string,
    rightText:PropTypes.string,
    isShowNotice: PropTypes.object
}