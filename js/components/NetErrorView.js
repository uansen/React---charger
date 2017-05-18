/**
 * Created by syl on 16/9/20.
 */
import React, {Component, PropTypes} from 'react';
import {TouchableHighlight,View,Image,Text,StyleSheet,TouchableOpacity} from 'react-native';


const styles = StyleSheet.create({
    container:{
        flexDirection:'column',
        alignItems:'center',
        justifyContent:'space-between',
        padding:100
    },

})
export default class NetErrorView extends Component {
    render(){
        return (
            <View style={styles.container}>
                <Image style={{width:120, height:60}}source={require("../assets/images/no_bill.png")}></Image>
                <TouchableOpacity onPress={this._refreshClick.bind(this)}>
                    <View>
                        <Text style={{fontSize:18,color:'gray',textAlign:'center'}}>Network error </Text>
                        <Text style={{fontSize:18,color:'gray',textAlign:'center'}}>Tap to load again</Text>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }
    _refreshClick(){
        if (this.props.refreshClick){
            this.props.refreshClick();
        }
    }
}
NetErrorView.propTypes = {
    refreshClick:PropTypes.func
}
