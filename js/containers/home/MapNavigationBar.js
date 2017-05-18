import React, {Component, PropTypes} from 'react';
import {StyleSheet, Text, TextInput, TouchableHighlight, View, Dimensions, Platform, Switch, TouchableOpacity,StatusBar,Image} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import ChargerIcon from '../../utils/chargerIcons';
import i18n from '../../utils/i18n';

import Button from 'apsl-react-native-button';

const width = Dimensions.get('window').width;

const styles = StyleSheet.create({
  header: {
    backgroundColor: 'rgb(115,143,254)',
    ...Platform.select({
      ios: {
        height: 64,
      },
      android: {
        height: 54,
      }
    }),
    paddingTop: 0,
    top: 0,
    right: 0,
    left: 0,
    position: 'absolute'
  },
  portrait:{
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'white'
  },
  menuButton:{
    position: 'absolute',
    ...Platform.select({
      ios: {
        top: 27,
      }
    }),
    width: 64,
    height: 44,
    left: 10
  },
  searchWrapper:{
    position: 'absolute',
    left: 77.5,
    right: 97.5,
    top: 29,
    height: 27
  },
  searchInput:{
    position: 'absolute',
    top: - 3,
    left: 0,
    right: 0,
    height: 30,
    borderWidth: 0,
    borderRadius: 15,
    backgroundColor:'white',
    paddingLeft:16,
    fontSize: 14
  },
  type_button:{
    top: 0,
    height: 26,
    width: 180,
    borderWidth: 0,
    borderRadius: 12,
  },

  switchButton:{
    position: 'absolute',
    right: 50,
    ...Platform.select({
      ios: {
        top: 30,
      }
    }),
    justifyContent: 'center',
    flexDirection: 'row'
  },

  filterButton:{
    position: 'absolute',
    right: 10,
    ...Platform.select({
      ios: {
        top: 28,
      }
    }),
    justifyContent: 'center',
    flexDirection: 'row'
  }
});

export default class MapNavigationBar extends Component {
  constructor(props){
    super(props);
  }

  render(){
    return (<View style={styles.header}>
      {this._renderMenuIcon()}
      {this._renderSearchInput()}
      {this._renderSwitch()}
      {this._renderFilter()}
    </View>);
  }

  _renderMenuIcon(){
    return (
        <TouchableOpacity underlayColor='#cccccc'
                            style={styles.menuButton} onPress={this._onMenuIconClick.bind(this)}>
          {/*<Icon name="ios-contact" size={30}
                color="white"
                backgroundColor="#EFEFF2"/>*/}
          <Image style={styles.portrait} source={require('../../assets/images/portrait.png')} />
        </TouchableOpacity>
  )
  }

  _renderSearchInput(){
    return (
      <View style={styles.searchWrapper}>
        <StatusBar backgroundColor="#ff0000" barStyle="light-content" animated={true}/>
        <TouchableOpacity style={{position:'absolute', left:0, right:0, top:0, bottom:0}}
                          onPress={this._onTextAreaClick.bind(this)}>
          <TextInput style={styles.searchInput } placeholder={i18n.MAP_ADDRESS} placeholderTextColor='rgb(153,153,153)'
                   editable={!this.props.disabled}>
          </TextInput>
        </TouchableOpacity>

      </View>);
  }

  _renderSwitch( ){
    return (<TouchableOpacity underlayColor='#cccccc'
            style={styles.switchButton} onPress={this._onSwitchIconClick.bind(this)}>
      {/*<Icon name="ios-menu" size={30} color='white' />*/}
      <ChargerIcon style={{color: 'rgb(255,255,255)'}} name={this.props.iconName} size={24}/>
    </TouchableOpacity>);
  }

  _renderFilter(){
    return (<TouchableOpacity underlayColor='#cccccc'
                                style={styles.filterButton}
                                onPress={this._onFilterIconClick.bind(this)}>
      {/*<Icon name="ios-funnel-outline" size={25} color="white"/>*/}
      <ChargerIcon style={{color: 'rgb(255,255,255)'}} name='icon_iconfont-01' size={27}/>
    </TouchableOpacity>);
  }

  _onMenuIconClick() {
    if (this.props.onMenuClicked) {
       this.props.onMenuClicked();
    }
  }

  _onSwitchIconClick(){
    if(this.props.onSwitchClicked){
      this.props.onSwitchClicked();
    }
  }

  _onFilterIconClick(){
    if(this.props.onFilterClicked){
      this.props.onFilterClicked();
    }
  }

  _onTextAreaClick(){
    if(this.props.disabled && this.props.onTextAreaClicked){
      this.props.onTextAreaClicked();
    }
  }
}

MapNavigationBar.propTypes = {
  onMenuClicked: PropTypes.func,
  disabled: PropTypes.bool,
  onTextAreaClicked: PropTypes.func,
  onSwitchClicked: PropTypes.func,
  onFilterClicked: PropTypes.func,
}

MapNavigationBar.defaultProps = {
  disabled: false
}