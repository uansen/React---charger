/**
 * Created by syl on 16/8/30.
 */
import React, {Component,PropTypes} from 'react';
import {View,Text,StyleSheet,Dimensions} from 'react-native';
const width = Dimensions.get('window').width;

export default class TextLabel extends Component {
    render(){
        return (
          <View style={this.props.style}>
            <Text style={styles.upText}>{this.props.title}</Text>
            <Text style={styles.downText}>{this.props.value}</Text>
          </View>
        );
    }
}
TextLabel.propTypes = {
    title:PropTypes.string,
    value:PropTypes.string,
}
const styles = StyleSheet.create({
    container:{
        flexDirection:'column',
        justifyContent:'space-between',
        alignItems:'center'
    },
    upText:{
        fontSize:13,
        color:'rgb(153,153,153)',
        textAlign:'center'
    },
    downText:{
        marginTop: 5,
        fontSize:13,
        color:'rgb(102,102,102)',
        textAlign:'center'
    }
})