import React, { Component, PropTypes } from 'react';
import { StyleSheet, View, Image, TouchableOpacity, Text,Alert,Dimensions,Modal} from 'react-native';
import { Actions } from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/Ionicons';
import ChargerIcon from '../../utils/chargerIcons';
import { connect } from '../../connect';
import i18n from '../../utils/i18n';

const { width,  height } = Dimensions.get('window');

class Reserver extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowReserver: false
    }
  };

  componentDidMount() {
    // this._showReserverTimeOut();
  }

  render() {
    return(
      <View style={styles.container}>
        {this._renderReserver()}
      </View>
    );
  }

  _renderReserver(){
    return (
      <Modal animationType="slide" visible={this.state.isShowReserver} transparent >
        <TouchableOpacity style={styles.popReserver} onPress={this._closeReserver.bind(this)} >
          <View style={styles.content}>
            <View style={styles.upView}>
              <View style={styles.titleView}>
                <Text style={styles.titleText}>{i18n.RESERVER_HINT}</Text>
              </View>
              <View style={styles.hintView}>
                <Text style={styles.hintText}>{i18n.RESERVER_TIME}</Text>
              </View>
            </View>
            <View style={styles.downView}>
              <TouchableOpacity style={{flexDirection: 'row',}} onPress={this._onOKClick.bind(this)} >
                <View style={styles.okView}>
                  <Text style={styles.okText}>{i18n.RESERVER_OK}</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={{flexDirection: 'row',}}  onPress={this._onCancelClick.bind(this)} >
                <View style={styles.cancelView}>
                  <Text style={styles.cancelText}>{i18n.RESERVER_CANCEL}</Text>
                </View>
              </TouchableOpacity>

            </View>
          </View>

        </TouchableOpacity>
      </Modal>
    );
  }

  _showReserverTimeOut(){
    this.timeOut = setTimeout(this._showReserver.bind(this),3000);
  }
  _showReserver(){
    this.setState({
      isShowReserver: true
    });
  }
  _closeReserver(){
    this.setState({
      isShowReserver: false
    });

    this._showReserverTimeOut();
  }



  _showReserverStart(){
    Alert.alert(
      i18n.RESERVER_HINT,
      i18n.RESERVER_TIME,
      [
        {text: i18n.RESERVER_CANCEL, onPress:this._onCancelClick.bind(this)},
        {text: i18n.RESERVER_OK, onPress:this._onOKClick.bind(this)}
      ]
    )
  }

  _showReserverOver(){
    Alert.alert(
      i18n.RESERVER_HINT_OVER,
      i18n.RESERVER_TIME_OVER,
      [
        {text: i18n.EXIT_OK, onPress: () => console.log('@@@ OK') }
      ]

    )
  }

  _onOKClick(){
    console.log('@@@@ _onOKClick');
    this._closeReserver();
    clearTimeout(this.timeOut)
    this.timeOut = setTimeout(this._showReserverOver.bind(this),5000);
  }

  _onCancelClick(){
    console.log('@@@@ _onCancelClick');
    this._closeReserver();
    clearTimeout(this.timeOut)
  }
}

const styles = StyleSheet.create({
  popReserver: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor:'rgba(0, 0, 0, 0.5)',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems:'center'
  },
  content: {
    width: 260,
    height: 195,
    backgroundColor: 'rgb(255,255,255)',
    borderRadius: 4,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems:'center'
  },
  upView: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems:'center'
  },
  downView: {
    marginTop: 20,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems:'center',
    marginLeft: 30,
    marginRight: 30
  },
  titleView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems:'center'
  },
  hintView: {
    marginTop:10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems:'center'
  },
  titleText: {
    textAlign: 'center',
    width: 250,
    fontSize: 16,
    color: 'rgb(51,51,51)'

  },
  hintText: {
    textAlign: 'center',
    fontSize: 14,
    color: 'rgb(102,102,102)'
  },
  cancelView: {
    marginTop: 10,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems:'center',
    backgroundColor: 'rgb(204,204,204)',
    borderRadius: 2,
    height: 40
  },
  okView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems:'center',
    backgroundColor: 'rgb(115,143,254)',
    borderRadius: 2,
    height: 40
  },
  cancelText: {
    textAlign: 'center',
    fontSize: 15,
    color: 'rgb(134,134,134)'
  },
  okText: {
    textAlign: 'center',
    fontSize: 15,
    color: 'rgb(255,255,255)'
  }
});

Reserver.propTypes = {

};

function mapStateToProps(state) {
  return{};
}

module.exports = connect(mapStateToProps)(Reserver);