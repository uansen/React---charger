/**
 * Created by syl on 16/8/31.
 */
import React, {Component, PropTypes} from 'react';
import {ActivityIndicator, Animated, Alert, StyleSheet, View, Dimensions,Text,TouchableHighlight,StatusBar} from 'react-native';
import QRCodeScreen from './QRCodeScreen';
import {Actions} from 'react-native-router-flux';
import { connect } from '../../connect';
import {getConnectorDetail} from '../../actions/connectorAction';
import {hideError} from '../../actions/rootAction';
import Icon from 'react-native-vector-icons/Ionicons';

const {height,width} = Dimensions.get('window');
const {heightScale,widthScale} = {heightScale: height / 667 , widthScale: width / 375};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  centering: {
    position: 'absolute',
    left: width / 2 - 10 * widthScale,
    top: height / 2 - 40 * heightScale
  }
});

/**
 * 扫码二维码, 获取充电桩信息界面
 */
export default class CameraQrContainer extends Component{
    constructor(props){
       super(props);
       this.state = {
         fadeAnim: new Animated.Value(0),
           isError:true
       }
    }

    componentDidMount(){
      setTimeout(() => {
        // this._onSuccess('dsfadfad106672');
      }, 1000);
    }

    componentWillReceiveProps(nextProps) {
      // 获取充电枪详情成功
      if(this.props.isFetching && !nextProps.isFetching && nextProps.connectorSpec){
        Actions.pop({
          refresh: {
            connectorSpec: nextProps.connectorSpec
          }
        });
      }else if(this.props.isFetching && !nextProps.isFetching && nextProps.error){
          //获取充电枪失败
        // Alert.alert('Tip',
        //     "Invalid qr-code, please check."
        // );

        setTimeout(() => {
          this.props.dispatch(hideError());
        }, 1000);
          this.setState({isError:true})
      }
    }

    render(){
        return(
          <View style={styles.contentContainer}>
            <StatusBar backgroundColor='rgba(0,0,0,0.3)' hidden={true} animated={true}/>
            <QRCodeScreen onSuccess={this._onSuccess.bind(this)} />
            {/*{*/}
              {/*this.props.isFetching ? <ActivityIndicator*/}
                {/*style={[styles.centering, {transform: [{scale: 1.5}]}]}*/}
                {/*size="large"*/}
              {/*/> : <View></View>*/}
            {/*}*/}


          </View>
        );
    }

    _renderContent(){
        if(this.props.isFetching){
            return <ActivityIndicator
                style={[styles.centering, {transform: [{scale: 1.5}]}]}
                size="large"
            />
        }
        if(this.state.isError){
            return (
              <View>
                <Text>Network Error</Text>
              </View>

            )
        }
    }

    _onSuccess(result) {
        console.log('@@@@ result ', result);
        if(result.length >= 6){
          // 聚点桩的id,通过url最后6位获取
          const connectorId = result.substr(-6);
          this.props.dispatch(getConnectorDetail(result));
        }
    }
}

CameraQrContainer.propTypes = {
  dispatch: PropTypes.func,
  isFetching: PropTypes.bool
}

function mapStateToProps(state){
  return state.get('connector').toJSON();
}

module.exports = connect(mapStateToProps)(CameraQrContainer);
