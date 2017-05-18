/**
 * Created by syl on 16/9/18.
 */
import React, {Component, PropTypes} from 'react';
import {StyleSheet, View,Dimensions} from 'react-native';
import i18n from '../utils/i18n';
import TextLabel from './TextLabel';

const {width, height} = Dimensions.get('window');
const styles = StyleSheet.create({
    container:{
        flexDirection:"row",
        justifyContent:"center",
        alignItems:'center',
        padding:15
    },
    content: {
      width: width * 0.5,
      flexDirection:'column',
      justifyContent:'center',
      alignItems:'center'
    }
});

export default class CustomBotomView extends Component {
    constructor(props) {
        super(props);
    }

    render(){

        return(
            <View style={styles.container}>
                <TextLabel style={styles.content} title={i18n.SERVICE_FEE} value={'HK$ ' + ((this.props.detailInfo && this.props.detailInfo.accessFee)
                ? this.props.detailInfo.accessFee : 'N/A')}/>
                <TextLabel style={styles.content} title={i18n.CHARGING_FEE} value={'HK$ '+ ((this.props.detailInfo &&
                this.props.detailInfo.connectionFee) ? this.props.detailInfo.connectionFee : 'N/A')+"/min"}/>
            </View>
        );
    }
}

CustomBotomView.propTypes = {
    detailInfo: PropTypes.object
}