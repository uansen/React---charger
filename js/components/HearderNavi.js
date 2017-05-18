/**
 * Created by syl on 16/8/25.
 */
import React, {Component, PropTypes} from 'react';
import {View, Text, StyleSheet, TouchableHighlight, Platform, Dimensions,TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {Actions} from 'react-native-router-flux';

export default class HearderNavi extends Component {
    constructor(props){
        super(props);
    }
    render(){
        return(
            <View style={styles.header}>
                {this._renderBackIcon()}
                {this._renderTitle(this.props.title)}
                {this._renderRightText()}
            </View>
        )

    }
    _renderBackIcon(){
        return(
            <TouchableOpacity underlayColor='#cccccc'
                                style={styles.menuButton} onPress={this._onBackIconClick.bind(this)}>
                {
                    this.props.leftText ?
                      <Text style={styles.leftText}>{this.props.leftText}</Text> :
                      <Icon name="ios-arrow-back" size={25}
                        color="white"
                        backgroundColor="#EFEFF2"/>
                }

            </TouchableOpacity>
        )
    }
    _renderTitle(){
        return(
            <Text style={styles.title}>{this.props.title }</Text>
        )
    }

    _renderRightText(){
        return(
            <TouchableOpacity underlayColor='#cccccc'
                                style={styles.menuButton} onPress={this._onRightClick.bind(this)}>
               <Text style={styles.rightText}>{this.props.rightText}</Text>
            </TouchableOpacity>
        )
    }
    _onBackIconClick(){
        Actions.pop();
    }
    _onRightClick(){
        if (this.props.onRightClick){
            this.props.onRightClick();
        }

    }
}
HearderNavi.propTypes = {
    title:PropTypes.string.isRequired,
    rightText:PropTypes.string,
    onRightClick:PropTypes.func,

}

const width = Dimensions.get('window').width;

const styles = StyleSheet.create({
    header: {
        backgroundColor: '#7592FB',
        paddingTop: 0,
        top: 0,
        ...Platform.select({
            ios: {
                height: 64,
            },
            android: {
                height: 54,
            }
        }),
        right: 0,
        left: 0,
        position: 'absolute',
        flex: 1,
        flexDirection: 'row'
    },
    menuButton:{
        ...Platform.select({
            ios: {
                marginTop: 20,
            }
        }),
        width: 64,
        height: 44,
        paddingLeft: 10,
        paddingTop: 7
    },
    title:{
        width:width-64-64,
        textAlign:'center',
        marginTop:30,
        height:34,
        fontSize:16,
        color:'white',
    },
    leftText:{
        textAlign:'center',
        fontSize:16,
        marginTop:6,
        marginLeft:-6,
        color:'white',

    },
    rightText:{
        textAlign:'center',
        fontSize:16,
        marginTop:6,
        color:'white',

    }

});