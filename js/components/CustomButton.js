/**
 * Created by syl on 16/8/17.
 */
import React, {Component, PropTypes} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Alert,
    ToastAndroid,
    TouchableHighlight,
    Dimensions,
    TouchableOpacity,
} from 'react-native';
const width = Dimensions.get('window').width;

export default class CustomButton extends Component {
    render() {
        return (
            <TouchableOpacity
                onPress={this.props.onPress} underlayColor='#7592FB'>
                <View style={styles.button}>
                    <Text style={styles.buttonText}>{this.props.text}</Text>
                </View>
            </TouchableOpacity>
        );
    }
}
const styles = StyleSheet.create({
    button:{
        width:0.8*width,
        height:50,
        backgroundColor:'#7592FB',
        borderRadius:10,
    },
    buttonText:{
        marginTop:10,
        textAlign:'center',
        color:'white',
        fontSize:20,
    }
})