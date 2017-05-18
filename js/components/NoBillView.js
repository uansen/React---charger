import React, {Component} from 'react';
import {View,Image,Text,StyleSheet,Dimensions} from 'react-native';
import i18n from '../utils/i18n';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const styles = StyleSheet.create({
    container: {
        flexDirection:'column',
        alignItems:'center',
        justifyContent:'center'
    },
    imageView: {
        marginTop: -0.25 * height
    },
    image: {
        width: 90,
        height: 100,
    },
    text: {
        color:'gray',
        fontSize:16,
        textAlign:'center',
        marginTop:20,
        marginBottom:20
    }
})
export default class NetErrorView extends Component {
    render(){
        return (
            <View style={styles.container}>
                <View style={styles.imageView}>
                    <Image style={styles.image} source={require("../assets/images/no_bill.png")}></Image>
                </View>
                <View>
                    <Text style={styles.text}>{i18n.NO_BILL}</Text>
                </View>
            </View>
        )
    }
}
