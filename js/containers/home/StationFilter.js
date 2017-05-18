/**
 * Created by HMac on 2016/9/29.
 */
import React,{Component,PropTypes} from 'react';
import {View,Text,Image,StyleSheet,TouchableOpacity, Dimensions,Switch} from 'react-native';
import { connect } from 'react-redux';
import ChargerIcon from '../../utils/chargerIcons';
import i18n from '../../utils/i18n';

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    shadowColor:'rgb(0,0,0)',
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.2
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 50,
    width: width,
    borderBottomColor: 'rgba(200,200,200,0.5)',
    borderBottomWidth: 1,
  },
  text: {
    marginLeft: 15,
    fontSize: 15
  },
  switch: {
    margin: 10
  }

})
export default class StationFilter extends Component {
  constructor(props){
    super(props);
    this.state = {
      availableChargerSwitch: true,
      freeChargerSwitch: true,
      fastChargerSwitch: true
    }

  }

  componentDidMount() {
    // 读取
    storage.load({
      key: 'autoUser',
      autoSync: true,
      syncInBackground: true
    }).then(ret => {
      if (ret.mobile) {
        storage.load({
          key: ret.mobile,
          id: 'station',
          autoSync: true,
          syncInBackground: true
        }).then(ret => {
          this.setState({
            availableChargerSwitch: ret.availableChargerSwitch,
            freeChargerSwitch: ret.freeChargerSwitch,
            fastChargerSwitch: ret.fastChargerSwitch
          });
        }).catch(err => {
          console.log(err.message);
        });
      }
    }).catch(err => {
      console.log(err.message);
    });
  }
  render(){
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.text}>{i18n.MAP_FILTER}</Text>
          <Switch style={styles.switch} onValueChange={(value) => this._onValueChange(value)}
            value={this.state.availableChargerSwitch} />
        </View>
        <View style={styles.content}>
          <Text style={styles.text}>{i18n.FREE_CHARGER_FILTER}</Text>
          <Switch style={styles.switch} onValueChange={(value) => this._freeChargerSwitch(value)}
                  value={this.state.freeChargerSwitch} />
        </View>
        <View style={styles.content}>
          <Text style={styles.text}>{i18n.FAST_CHARGER_FILTER}</Text>
          <Switch style={styles.switch} onValueChange={(value) => this._fastChargerSwitch(value)}
                  value={this.state.fastChargerSwitch} />
        </View>
      </View>
    )
  }

  _onValueChange(value){
    this.setState({
      availableChargerSwitch: value
    });
    this._saveSwitch();
  }

  _freeChargerSwitch(value){
    this.setState({
      freeChargerSwitch: value
    });

    this._saveSwitch();
  }

  _fastChargerSwitch(value){
    this.setState({
      fastChargerSwitch: value
    });

    this._saveSwitch();
  }

  _saveSwitch(){
    storage.load({
      key: 'autoUser',
      autoSync: true,
      syncInBackground: true
    }).then(ret => {
      if (ret.mobile) {
        storage.save({
          key: ret.mobile,
          id: "station",
          rawData:{
            availableChargerSwitch: this.state.availableChargerSwitch,
            freeChargerSwitch: this.state.freeChargerSwitch,
            fastChargerSwitch: this.state.fastChargerSwitch
          }
        })
      }
    }).catch(err => {
      console.log(err.message);
    });

    this.props.onChangeStatus();
  }
}
StationFilter.propTypes = {

}

function mapStateToProps(state){
  return {

  };
}
module.exports = connect(mapStateToProps)(StationFilter);