import React, { Component, PropTypes } from 'react';
import { StyleSheet, View, Image, Text,Animated,TouchableOpacity} from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { connect } from '../../connect';

const styles = StyleSheet.create({
  container: {
    width: 30,
    height: 30
  },
  pinWrapper: {
    width: 22,
    height: 30
  },
  clickPin: {
    width: 35,
    height: 40
  },
  pinCircleWrapper:{
    position: 'absolute',
    width: 26,
    height: 26
  },
  pinBg: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor:'#ffffff',
    shadowColor:'#555555',
    shadowOffset: {
      width: 1,
      height: 1
    },
    shadowOpacity: 0.6,
    shadowRadius: 1
  },
  pinCircle:{
    position: 'absolute',
    width: 30,
    height: 30,
    left: 2,
    top: 2,
    backgroundColor: 'transparent'
  },
  pinText: {
    position: 'absolute',
    left: 9,
    top: 5,
    color: '#666666',
    fontSize: 14,
    backgroundColor: 'transparent'
  }
});

class AnnotationView extends Component{
  constructor(props) {
    super(props);
    this.state = {
      bounceValue: new Animated.Value(1)
    }
  };

  _zoomInAnimation(){
    Animated.spring(
      this.state.bounceValue,
      {
        toValue: 1.2,
        friction: 1
      }
    ).start();
  }

  _zoomOutAnimation(){
    Animated.spring(
      this.state.bounceValue,
      {
        toValue: 1.0,
        friction: 7
      }
    ).start();
  }

  componentDidUpdate() {
    const itemMarkers = this.props.item.getMarkers();
    if (itemMarkers[0].getInfo().id === this.props.stationId){
      this._zoomInAnimation()
    }else {
      this._zoomOutAnimation()
    }
  }
  render(){
    const itemMarkers = this.props.item.getMarkers();
    let pinView =<View style={styles.container}></View>;
    if(itemMarkers.length === 1){
      pinView = (<View style={styles.container}>
        {
          itemMarkers[0].getInfo().idleNum > 0 ?
            <Animated.Image style={[styles.pinWrapper ,{transform: [{scale: this.state.bounceValue}]}]} source={require('../../assets/images/pin.png')} />
            :
            <Image style={styles.pinWrapper} source={require('../../assets/images/pinfull.png')} />
        }


      </View>);

    }else{
      // 计算聚集点中空闲桩的比例
      let totalNum = 0;
      let idleNum = 0;
      for(let i = 0; i < itemMarkers.length; i++){
        totalNum += itemMarkers[i].getInfo().number;
        idleNum += itemMarkers[i].getInfo().idleNum;
      }

      if(totalNum === 0){
        totalNum = 1;
      }

      pinView = (<View style={styles.pinCircleWrapper}>
        <View style={styles.pinBg}></View>
        <AnimatedCircularProgress
          style={styles.pinCircle}
          size={24}
          width={5}
          fill={Math.round(idleNum * 100 / totalNum)}
          tintColor="#656AFF"
          backgroundColor="#999999"
          tension={1000}>
        </AnimatedCircularProgress>
        <Text style={styles.pinText}>{itemMarkers.length}</Text>
      </View>);
    }
    return pinView;
  }
}

AnnotationView.propTypes = {
  item: PropTypes.object
};

function mapStateToProps(state){
  return{

  };
}

module.exports = connect(mapStateToProps)(AnnotationView);
