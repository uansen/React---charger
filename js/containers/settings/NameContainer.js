import React, {Component, PropTypes} from 'react';
import {StyleSheet, Text, View,ListView,Platform, Image,TouchableOpacity,TextInput,Dimensions} from 'react-native';
import { connect } from 'react-redux';
import HearderNavi from '../../components/HearderNavi'
import i18n from '../../utils/i18n';
import Icon from 'react-native-vector-icons/Ionicons';

const {width, height} = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'column',
    backgroundColor: 'rgb(248,248,248)'
  },
  content: {
    ...Platform.select({
      ios: {
        marginTop: 64,
      },
      android: {
        marginTop: 54,
      }
    }),
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingLeft: 0,
    paddingRight: 0,
    backgroundColor: 'white',
  },
  row: {
    height: 50,
    width:width,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgb(220,220,220)'

  },
  text: {
    flex: 1,
    marginLeft: 15,
    marginRight: 5,
    color: 'rgb(102,102,102)',
    fontSize: 15
  }
});

class Name extends Component {
  constructor(props){
    super(props);
    this.state = {
      name: this.props.user.userId.toString()
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <HearderNavi title={i18n.PROFILE_NAME} leftText="Cancel" rightText="OK" ></HearderNavi>
        {this.renderContent()}
      </View>
    );
  }

  renderContent() {
    return(
      <View style={styles.content}>
        <View style={styles.row}>
          <TextInput style={styles.text} onChangeText={(Text) => this.setState({name: Text})} clearButtonMode="while-editing" value={this.state.name} />
        </View>
      </View>
    );
  }
}


Name.propTypes = {
  dispatch: PropTypes.func,
  history: PropTypes.any
};

function mapStateToProps(state){
  return{
    user: state.getIn(['login', 'user']) ? state.getIn(['login','user']).toJSON():null,
  };
};

module.exports = connect(mapStateToProps)(Name);
