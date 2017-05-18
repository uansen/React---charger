import React, {Component, PropTypes} from 'react';
import {StyleSheet, Text, View,ListView,Platform, Image,TouchableOpacity} from 'react-native';
import { connect } from 'react-redux';
import HearderNavi from '../../components/HearderNavi'
import i18n from '../../utils/i18n';
import Icon from 'react-native-vector-icons/Ionicons';
import {Actions} from 'react-native-router-flux';

const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

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
    paddingLeft: 15,
    paddingRight: 0,
    backgroundColor: 'white',
  },
  row: {
    // height: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgb(220,220,220)'

  },
  text: {
    color: 'rgb(102,102,102)',
    fontSize: 15
  },
  rightView: {
    width: 200,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginRight: 15
  },
  rightText: {
    fontSize: 14,
    color: 'rgb(153,153,153)',
    marginRight: 15
  },
  portrait: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 15,
    borderWidth: 1,
    borderColor: 'white'
  },
});

class PersonalProfileContainer extends Component {
  constructor(props){
    super(props);
    this.state = {
      dataSource: null
    }
  };

  componentDidMount() {
    const rowDataSource = [
      {
        title: i18n.PROFILE,
        text: null,
        icon: require('../../assets/images/portrait.png'),
        index: 0
      },
      {
        title: i18n.PROFILE_NAME,
        text: this.props.user.userId,
        icon: null,
        index: 1
      },
      {
        title: i18n.PROFILE_PASSWORD,
        text: null,
        icon: null,
        index: 2
      },
      {
        title: i18n.PROFILE_LOCATION,
        text: null,
        icon: null,
        index: 3
      },
      {
        title: i18n.PROFILE_PHONE_NUMBER,
        text: this.props.user.mobile,
        icon: null,
        index: 4
      }
    ];

    this.setState({
      dataSource: ds.cloneWithRows(rowDataSource)
    });
  }
  render() {
    return (
      <View style={styles.container}>
        <HearderNavi title={i18n.BASIC_INFORMATION}></HearderNavi>
        {this.renderContent()}
      </View>
    );
  }

  renderContent() {
    return(
      <View style={styles.content}>
        {
          this.state.dataSource &&
          <ListView
            dataSource={this.state.dataSource}
            renderRow={this._renderRow.bind(this)}
            initialListSize={5}
          />
        }

      </View>
    );
  }

  _renderRow(rowData) {
    return(
      <TouchableOpacity style={styles.button} onPress={this._pressRow.bind(this,rowData)}>
        <View style={[styles.row ,{ height : rowData.index ? 50 : 60}]}>
          <Text style={styles.text}>{rowData.title}</Text>
          <View style={styles.rightView}>
            {rowData.icon && <Image style={styles.portrait} source={rowData.icon} />}
            {rowData.text && <Text style={styles.rightText}>{rowData.text}</Text>}
            <Icon name="ios-arrow-forward" size={24} color="rgb(204,204,204)" />
          </View>

        </View>
      </TouchableOpacity>
    );
  }

  _pressRow(rowData){
    console.log('@@@@ rowData -- ' + rowData.title);
    switch (rowData.title){
      case i18n.PROFILE_NAME :
        Actions.name();
        break;
      default:
        break;
    }


  }
}


PersonalProfileContainer.propTypes = {
  dispatch: PropTypes.func,
  history: PropTypes.any
};

function mapStateToProps(state){
  return{
    user: state.getIn(['login', 'user']) ? state.getIn(['login','user']).toJSON():null,
  };
};

module.exports = connect(mapStateToProps)(PersonalProfileContainer);
