/**
 * Created by HMac on 2016/11/10.
 */

import React, {Component, PropTypes} from 'react';
import {View, Easing, TouchableOpacity, Text} from 'react-native';

import MapContainer from './MapContainer';
import SearchListContainer from '../search/SearchListContainer';
import FlipView from 'react-native-flip-view';

export default class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isFlipped: false
    };
  }

  render = () => {
    return (
      <FlipView style={{flex: 1,backgroundColor: 'rgb(127,153,254)',}}
                front={this._renderMap()}
                back={this._renderList()}
                isFlipped={this.state.isFlipped}
                onFlipped={(val) => {console.log('Flipped: ' + val);}}
                flipAxis="y"
                flipEasing={Easing.out(Easing.ease)}
                flipDuration={2000}
                perspective={1000}/>
    );
  };

  _renderMap = () => {
    return (
      <MapContainer onSwitch={this._flip.bind(this)} />
    );
  };

  _renderList = () => {
    return (
      <SearchListContainer onSwitch={this._flip.bind(this)} />
    );
  };

  _flip = () => {
    this.setState({isFlipped: !this.state.isFlipped});
  };
}
