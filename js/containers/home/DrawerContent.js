import React, { Component, PropTypes } from 'react';
import { StyleSheet, View, Image, TouchableOpacity, Text,Alert,Dimensions} from 'react-native';
import { Actions } from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/Ionicons';
import ChargerIcon from '../../utils/chargerIcons';
import {logout} from '../../actions/loginAction';
import { connect } from '../../connect';
import i18n from '../../utils/i18n';

const { width,  height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    height: height,
    width: width * 2,
    // backgroundColor: 'rgb(248,248,248)',
    backgroundColor: 'rgb(127,153,254)'
  },
  portraitWrapper:{
    height: 154,
    width: width,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    // backgroundColor: 'rgb(127,153,254)',
  },
  verticalLayout:{
    marginLeft: 20,
    marginBottom: 22,
    flexDirection: 'row',
    justifyContent: 'flex-start'
  },
  portrait:{
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'white'
  },
  usernameView: {
    flexDirection: 'column',
    justifyContent: 'center'
  },
  username: {
    color: '#ffffff',
    fontSize: 16,
    marginLeft: 20,
    textAlign: 'center'
  },
  menuWrapper: {
    height:height,
    width: width,
    // backgroundColor: 'rgb(115,143,254)'
  },
  menuItem: {
    marginTop: 36,
    justifyContent: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center'
  },
  menuIcon: {
    color: '#ffffff',
    marginLeft: 48,
    justifyContent: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center'
  },
  menuText: {
    color: '#ffffff',
    marginLeft: 20,
    fontSize: 14
  },
  moneyText: {
    color: 'rgba(255,255,255,0.5)',
    marginTop: 4,
    marginLeft: 22,
    fontSize: 12
  },
  helpIconWrapper: {
    marginTop: 120,
    marginLeft: 48,
    flexDirection: 'row',
    justifyContent: 'flex-start'
  },
  helpIcon: {
    color: '#ffffff'
  }
});

const menuDataSource = [
  {
    label: i18n.MENU_BLANCE,
    icon: 'icon_iconfont-04',
    action: 'balance'
  },
  {
    label: i18n.MENU_CARD,
    icon: 'icon_iconfont-05',
    action: null
  },
  {
    label: i18n.MENU_BILL,
    icon: 'icon_iconfont-06',
    action: 'billList'
  },
  // {
  //   label: i18n.MENU_PROFILE,
  //   icon: 'icon_iconfont-07',
  //   action: 'profile'
  // },
  {
    label: i18n.MENU_SETTINGS,
    icon: 'icon_iconfont-08',
    action: 'settings'
  },
  {
    label: i18n.MENU_ABOUT,
    icon: 'icon_iconfont-09',
    action: null
  }
];

class DrawerContent extends Component {
  static contextTypes = {
    drawer: PropTypes.object.isRequired
  };


  render() {
    const { drawer } = this.context;
    return(
      <View style={styles.container}>
        {this._renderPortrait()}
        {this._renderMenus(drawer)}

      </View>
    );
  }

  _renderPortrait(){
    return (
      <View style={[styles.portraitWrapper,this.props.isOpen ? {backgroundColor: 'rgb(127,153,254)'} : {}]}>
        <View style={styles.verticalLayout}>
          <TouchableOpacity style={styles.button} onPress={() => {Actions.profile()}}>
            <View>
              <Image style={styles.portrait} source={require('../../assets/images/portrait.png')} />
            </View>
          </TouchableOpacity>
          <View style={styles.usernameView}>
            <Text style={styles.username}>{this.props.user.mobile}</Text>
          </View>
        </View>
      </View>
    );
  }

  _renderMenus(drawer){
    return (
      <View style={[styles.menuWrapper,this.props.isOpen ? {backgroundColor: 'rgb(115,143,254)'} : {}]}>
        {
          menuDataSource.map((data, index) =>
            <TouchableOpacity key={index} style={styles.menuItem}
              onPress={() => {
                {/*drawer.close();*/}
                if(this.props.onMenuClicked && data.action) {
                  this.props.onMenuClicked(data.action);
                }
              }}>
              <ChargerIcon style={styles.menuIcon} name={data.icon} size={22} />
              <Text style={styles.menuText}>{data.label}</Text>
              {index === 0 ? <Text style={styles.moneyText}>HK$213</Text> : <View></View>}
            </TouchableOpacity>)
        }
        {this._renderHelpIcon()}
      </View>
    );
  }

  _renderHelpIcon(){
    return (
      <TouchableOpacity style={styles.helpIconWrapper}>
        <ChargerIcon style={styles.helpIcon} name="icon_iconfont-10" size={22}/>
        <Text style={styles.menuText}>{i18n.MENU_HELP}</Text>
      </TouchableOpacity>
    )
  }

  _logoutClick(){
    this.props.dispatch(logout());
    Actions.pop();
    Actions.login();
  }
}

DrawerContent.propTypes = {
  drawer: PropTypes.object,
  onMenuClicked: PropTypes.func
};

function mapStateToProps(state) {
  return state.get('login').toJSON();
}

module.exports = connect(mapStateToProps)(DrawerContent);