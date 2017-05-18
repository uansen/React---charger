/**
 * Created by syl on 16/8/26.
 */
import React, {Component} from 'react';
import {Dimensions,View} from 'react-native';
const width = Dimensions.get('window').width;

export default class SeparateLine extends Component {
    render(){
        return(
            <View style={{width:0.9*width, backgroundColor:'lightgrey', height:1, marginLeft:0.05*width, marginRight:0.05*width}}></View>
        )
    }
}