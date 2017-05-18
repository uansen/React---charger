/**
 * Created by syl on 16/9/23.
 */
import React,{Component,PropTypes} from 'react';
import {View,Text,Image,StyleSheet,TouchableOpacity, Dimensions} from 'react-native';
import { connect } from 'react-redux';
import ChargerIcon from '../../utils/chargerIcons';
import {removeChargeNotice,removeCurrentStation} from '../../actions/stationAction';
import i18n from '../../utils/i18n';

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;
const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  subContainer: {
    flexDirection:'row',
    marginBottom: 15
  },
  normalDollaIcon: {
    marginLeft: 15
  },
  mormalView: {
    width: 200,
    height: 21,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  normalText: {
    color: '#ffffff',
    marginLeft: 16,
    textAlign:'left'
  },
  connectView: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15
  },
  roundView: {
    backgroundColor: '#ffffff',
    height: 3.6,
    width: 3.6,
    borderRadius: 1.8
  },
  lineView: {
    backgroundColor: '#ffffff',
    height: 18,
    width: 1
  },
  roundViewTwo: {
    backgroundColor: '#ffffff',
    height: 4,
    width: 4,
    borderRadius: 2
  },
  downView: {
    marginTop: 28,
    borderWidth: 1,
    borderRadius: 2,
    borderColor: '#ffffff',
    width: 250,
    height: 40,
    flexDirection: 'column',
    justifyContent: 'center'
  },
  downText: {
    color: '#ffffff',
    textAlign: 'center'
  }
})
export default class ChargeNotice extends Component {
    render(){
        return (
            <View style={styles.container}>
                <View style={styles.subContainer}>
                    <ChargerIcon style={styles.normalDollaIcon} name="icon_iconfont-11"
                                 size={21} color="#cccccc" borderWidth={3}/>
                    <View style={styles.mormalView}>
                      <Text style={styles.normalText}>{i18n.SCAN}</Text>
                    </View>


                </View>

                <View style={styles.connectView}>
                  <View style={styles.roundView} />
                  <View style={styles.lineView} />
                  <View style={styles.roundViewTwo} />

                </View>

                <View style={styles.subContainer}>
                  <ChargerIcon style={styles.normalDollaIcon} name="icon_iconfont-13"
                               size={20} color="#cccccc" borderWidth={3}/>
                  <View style={styles.mormalView}>
                    <Text style={styles.normalText}>{i18n.HINT_START}</Text>
                  </View>
                </View>

                <View style={styles.connectView}>
                  <View style={styles.roundView} />
                  <View style={styles.lineView} />
                  <View style={styles.roundViewTwo} />

                </View>

                <View style={styles.subContainer}>
                    <ChargerIcon style={styles.normalDollaIcon} name="icon_iconfont-14"
                                 size={20} color="#cccccc" borderWidth={3}/>
                    <View style={styles.mormalView}>
                      <Text style={styles.normalText}>{i18n.FINISH}</Text>
                    </View>
                </View>

                <TouchableOpacity onPress={this._onClose.bind(this)}>
                  <View style={styles.downView}>
                      <Text style={styles.downText}>{i18n.SEE}</Text>

                  </View>
                </TouchableOpacity>
            </View>
        )
    }

    _onClose(){
        this.props.onCallback();
    }

}
ChargeNotice.propTypes = {
    onCallback:PropTypes.func
}

function mapStateToProps(state){
  return {

  };
}
module.exports = connect(mapStateToProps)(ChargeNotice);