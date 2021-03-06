import React, {Component, PropTypes} from 'react';
import {Image, MapView, StyleSheet, Text, TextInput,
  TouchableOpacity, View, Dimensions} from 'react-native';
import { connect } from 'react-redux';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    borderWidth: 1,
    flexDirection: 'column'
  }
});

class PhoneRegisterContainer extends Component {
  constructor(props){
    super(props);
    this.state = {
      position: null,
      mapRegion: {
        latitude: 31.22,
        longitude: 121.48,
        latitudeDelta: 0.3,
        longitudeDelta: 0.3
      }
    };
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>Phone registration</Text>
      </View>
    );
  }
}

PhoneRegisterContainer.propTypes = {
  dispatch: PropTypes.func,
  history: PropTypes.any
};

function mapStateToProps(state){
  return {};
};

module.exports = connect(mapStateToProps)(PhoneRegisterContainer);
