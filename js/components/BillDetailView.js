/**
 * Created by syl on 16/8/29.
 */
import React, {Component, PropTypes} from 'react';
import {View, Text, TextInput, StyleSheet,Dimensions} from 'react-native';

const width = Dimensions.get('window').width;

export default class BillDetailView extends Component {
    render(){
        return (
            <View style={styles.continer}>
                <Text style={styles.leftView}>{this.props.leftText}</Text>
                <TextInput style={styles.rightView} placeholder={this.props.rightText} multiline={true} editable={false}></TextInput>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    continer:{
        width:width,
        height:50,
        flexDirection:'row',
        justifyContent: 'center',
        marginTop:28,
        flex: 1,
        alignItems: 'flex-start'

    },
    leftView:{
        width:0.3*width,
        textAlign:'left',
        fontSize:14,
        color: 'rgb(102,102,102)'
    },
    rightView:{
        marginTop: -5,
        width:0.5*width,
        fontSize:14,
        color: 'rgb(153,153,153)',
        textAlign:'left'
    }
})

BillDetailView.propTypes = {
    leftText:PropTypes.string,
    rightText:PropTypes.string,
}