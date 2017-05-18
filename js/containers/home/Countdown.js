import React, { Component, PropTypes } from 'react';
import { StyleSheet, View, Image, TouchableOpacity,TouchableWithoutFeedback, Text,Alert,Dimensions,Modal,Animated} from 'react-native';
import { connect } from '../../connect';
import LinearGradient from 'react-native-linear-gradient';
import * as Progress from 'react-native-progress';


const { width,  height } = Dimensions.get('window');

const styles = StyleSheet.create({
  content: {
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
    height: 60,
    width: 60,
    borderRadius: 30,
    backgroundColor:'rgb(255,255,255)',
    shadowColor: 'rgb(107,152,56)',
    shadowRadius: 1,
    shadowOpacity: 10,
    shadowOffset: {
      height: 0.2
    },
  },
  contentFiveMI: {
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
    height: 60,
    width: 60,
    borderRadius: 30,
    backgroundColor:'rgb(255,255,255)',
    shadowColor: 'rgb(255,118,118)',
    shadowRadius: 1,
    shadowOpacity: 10,
    shadowOffset: {
      height: 0.2
    },
  },
  timeView: {
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
    height: 50,
    width: 50,
    borderRadius: 25,
    shadowColor: 'rgb(107,152,56)',
    shadowRadius: 1,
    shadowOpacity: 0.8,
    shadowOffset: {
      height: 0.2
    }
  },
  timeViewFiveMI: {
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
    height: 50,
    width: 50,
    borderRadius: 25,
    shadowColor: 'rgb(255,118,118)',
    shadowRadius: 1,
    shadowOpacity: 0.8,
    shadowOffset: {
      height: 0.2
    }
  },
  timeText: {
    fontSize: 13,
    color: 'rgb(255,255,255)',
    backgroundColor: 'rgba(0,0,0,0)'
  },
  circular: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    backgroundColor: 'rgba(0,0,0,0)'
  },
  imageView: {
    position: 'absolute',
    top: -1,
    left: -1,
    width:52,
    height:52,
    justifyContent: 'center',
    flexDirection: 'row',
  },
  image: {
    marginTop: -7
  }
});

class Countdown extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rotate: 0,
      isShowReserver: false,
      isFiveMI: false,
      num: 1.0
    }
  }
  _startAnimation(){
    this.state.Anim.setValue(0);
    Animated.timing(
      this.state.Anim,
      {toValue: 1 - this.state.num,
        duration:1000
      },
    ).start();
  }

  _timeUpdate() {
    if (this.state.num < 0.2){
      this.setState({
        num: 1.0,
        rotate: 0
      });
    }else {
      this.setState({
        isFiveMI: true,
        num: this.state.num - 0.2,
        rotate: this.state.rotate + 72
      });
    }
  }

  render() {
    return(
      <TouchableWithoutFeedback onPress={this._timeUpdate.bind(this)}>
        <View style={this.props.style}>
            {this.state.isFiveMI ? this.renderTimeFiveMI() : this.renderTime()}
        </View>
      </TouchableWithoutFeedback>
    );
  }

  renderTime() {
    return(
      <View style={styles.content}>
        <LinearGradient start={[1.0, 1.0]} end={[0.0, 0.0]}
                        locations={[0.0,0.5,1.0]}
                        colors={['rgb(138,240,63)', '#A4D66B', 'rgb(188,229,141)']}
                        style={styles.timeView}>
          <Text style={styles.timeText}>
            35min
          </Text>
        </LinearGradient>
      </View>
    );
  }

  renderTimeFiveMI() {
    return (
      <View style={styles.contentFiveMI}>
        <LinearGradient start={[1.0, 1.0]} end={[0.0, 0.0]}
                        locations={[0.0, 0.5, 1.0]}
                        colors={['rgb(255,81,81)', '#FF5757', 'rgb(255,118,118)']}
                        style={styles.timeViewFiveMI}>
          <Progress.Circle style={styles.circular}
                           size={50}
                           borderWidth={0}
                           color="white"
                           progress={this.state.num}
                           thickness={2}
                           direction="counter-clockwise"
                           animated={false}/>

          { this.state.rotate < 360 &&
            <Animated.View style={[styles.imageView,{
              transform:[{rotate: this.state.rotate +'deg'}]}
            ]}>
              <Image style={styles.image} source={require('../../assets/images/countdown@2x.png')} />
            </Animated.View>
          }
          <Text style={styles.timeText}>
            03:23
          </Text>
        </LinearGradient>
       </View>
    );
  }

}

Countdown.propTypes = {

};

function mapStateToProps(state) {
  return{};
}

module.exports = connect(mapStateToProps)(Countdown);