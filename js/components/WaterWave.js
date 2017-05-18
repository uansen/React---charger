/**
 * Created by HMac on 2016/11/8.
 */

import React, { Component, PropTypes } from 'react';
import { requireNativeComponent } from 'react-native';

var WaterWave = requireNativeComponent('WaterWave', WaterWaveView);

class WaterWaveView extends Component {

  render() {
    return <WaterWave {...this.props} />;
  }
}

WaterWaveView.propTypes = {

  percent: React.PropTypes.number,

};

module.exports = WaterWaveView;