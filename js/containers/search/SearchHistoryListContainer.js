/**
 * Created by syl on 16/8/17.
 */
import React, {Component, PropTypes} from 'react';
import {TextInput,Platform,Dimensions,StyleSheet,
  Text, View, ListView, TouchableOpacity, TouchableHighlight, Alert,ActivityIndicator,StatusBar} from 'react-native';
import { connect } from 'react-redux';
import SearchHistoryBar from './SearchHistoryBar';
import Icon from 'react-native-vector-icons/Ionicons';
import Button from 'apsl-react-native-button';
import {Actions} from 'react-native-router-flux';
import customButton from '../../components/CustomButton';
import {getCurrentCityName, getSuggestionList} from '../../utils/baiduMapApi';
import SeparateLine from '../../components/SeparateLine'
import {getNearestChargeStations, setCurrentPosition} from '../../actions/stationAction';
import {diagonalDistanceOfRegion} from '../../mapCluster/distance';
import {_onRegionChangeComplete} from '../home/MapContainer';
import Storage from 'react-native-storage';
const dismissKeyboard = require('dismissKeyboard');
import i18n from '../../utils/i18n';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const HISTORYADDRESS = 'historyAddress';

class SearchHistoryListContainer extends Component{
    constructor(props){
        super(props);
        // this.renderItem=this.renderItem.bind(this);
        var ds=new ListView.DataSource({
            rowHasChanged:(row1, row2)=>row1 !== row2,
        });
        this.state={
            ds,
            searchString:'',
            latitude:'',
            longitude:'',
            cityCode: null,
            animating: false,
            historyAddressList: [],
            userMobile: ''
        };
    }

    render(){
        return(
            <View >
                <StatusBar backgroundColor="#ff0000" barStyle="light-content" animated={true}/>
                <View style={styles.header}>
                    {this._renderBackIcon()}
                    {this._renderSearchInput()}
                    {this._renderSearchAction()}
                </View>
                {this.renderContent(
                    this.state.ds === undefined ? [] : this.state.ds)}
            </View>

        )
    }

    _renderBackIcon(){
        return (
            <TouchableOpacity underlayColor='#cccccc'
                                style={styles.menuButton} onPress={this._onBackIconClick}>
                <Icon name="ios-arrow-back" size={26}
                      color="white"
                      backgroundColor="#EFEFF2"/>
            </TouchableOpacity>
        )
    }

    _renderSearchInput(){
        return (
            <View style={styles.searchWrapper}>
                <TouchableOpacity onPress={this._onTextAreaClick}>
                    <TextInput style={styles.searchInput } placeholder={i18n.MAP_ADDRESS} placeholderTextColor='rgb(153,153,153)'
                               editable={!this.props.disabled} onChangeText={this.onSearchTextChanged.bind(this)} value={this.state.searchString}
                               onSubmitEditing={this._onSearchActionClick.bind(this)} onFocus={this._onClick.bind(this)} autoFocus >
                    </TextInput>
                </TouchableOpacity>

            </View>);
    }

    _renderSearchAction(){
        return (<TouchableOpacity underlayColor='#cccccc'
                                    style={styles.actionButton} onPress={this._onSearchActionClick.bind(this)}>
            <Text style={{color:'rgb(254,254,254)', textAlign:'center',fontSize: 16}}>{i18n.MAP_SEARCH}</Text>

        </TouchableOpacity>);
    }

    _onBackIconClick() {
       Actions.main();
    }

    _onClick() {

        if(this.state.searchString && this.state.searchString.length > 0){
            return;
        }

        // 读取
        storage.load({
            key: 'autoUser',
            autoSync: true,
            syncInBackground: true
        }).then(ret => {
            if (ret.mobile){
                this.setState({userMobile : ret.mobile});
                storage.load({
                    key: ret.mobile,
                    id: 'search',
                    autoSync: true,
                    syncInBackground: true
                }).then(ret => {
                    if (ret.historyAddress){
                        this.setState({
                            historyAddressList: ret.historyAddress
                        });

                        this._handleResponce(ret.historyAddress);
                    }
                }).catch(err => {});

            }
        }).catch(err => {
            switch (err.name) {
                case 'NotFoundError':
                    break;
                case 'ExpiredError':
                    break;
            }
        })


    }

    _appendHistoryAddress(historyAddress){

        const addressList = this.state.historyAddressList;
        const index = addressList.indexOf(historyAddress);
        if (index !== -1 ){
            addressList.splice(index,1);
        }

        if (addressList.length > 6){
            addressList.pop();
        }

        for (let i = 0;i < addressList.length; i ++){
            if (addressList[i].name === historyAddress.name){
                addressList.splice(i,1);
            }
        }

        this.setState({historyAddressList:this.state.historyAddressList.unshift(historyAddress)});

        storage.load({
            key: 'autoUser',
            autoSync: true,
            syncInBackground: true
        }).then(ret => {
            if (ret.mobile) {
                storage.save({
                    key: this.state.userMobile,
                    id: 'search',
                    rawData: {
                        historyAddress: this.state.historyAddressList
                    },

                    // 如果设为null，则永不过期
                    expires: null
                });
            }
        }).catch(err => {});
    }

    onSearchTextChanged(text){
        this.setState({searchString: text});

        if (text && text.length > 0){
            this._getSuggestionList();
        }

    }
    renderContent(dataSource){
        return(
            <View style={styles.container}>
                <ActivityIndicator animating={this.state.animating}
                  style={[styles.centering, {transform: [{scale: 1}]}]}
                  size="large"
                />
                <ListView dataSource={dataSource}
                          renderRow={this.renderItem.bind(this)}
                          keyboardDismissMode ='on-drag'
                          keyboardShouldPersistTaps={true} />

                <View style={styles.buttonView}>
                    {
                        this.state.historyAddressList.length > 0 ?
                          <TouchableOpacity onPress={()=>Alert.alert('',i18n.IS_CLEAR_HISTORY,[{text:i18n.EXIT_OK,onPress:()=>this._onClickClearHistory()},
                              {text:i18n.EXIT_CANCEL,onPress:()=>this._onClickNoClearHistory()}])}>
                              <View style={styles.clear_button} >
                                  <Text style={styles.button_text}>{i18n.CLEAR_HISTORY}</Text>
                              </View>
                          </TouchableOpacity> : null

                    }
                </View>



            </View>
        )

    }
    renderItem(rowData, sectionID, rowID){
        return(
            <TouchableOpacity onPress={() =>this._pressRow(rowData)} >
                <View style={styles.row} key={rowData.uid}>
                    {/*<View style={styles.upview}>  <Text style={styles.right_text_up} >{rowData.name}</Text>*/}

                    {this._changeFontColor(rowData.name)}

                        {/*<View style={styles.leftview}>*/}
                            {/*<Icon name="ios-pin-outline" size={30}*/}
                                  {/*color="#828287"*/}
                                  {/*backgroundColor="#EFEFF2"/>*/}
                        {/*</View>*/}
                        {/*<View style={styles.rightview}>*/}
                            {/*<Text style={styles.right_text_down}>Some address</Text>*/}
                        {/*</View>*/}
                    {/*</View>*/}
                <SeparateLine ></SeparateLine>
            </View>
            </TouchableOpacity>
        )
    }

    _pressRow(rowData){

        console.log('@@@@@@ rowData');
        this._appendHistoryAddress(rowData);

        const position = rowData.location;
        if (position) {
            this.props.dispatch(setCurrentPosition(position.lat, position.lng,this.props.currentPosition.latitudeDelta,this.props.currentPosition.longitudeDelta,rowData.name));
            Actions.main({
                refresh: {
                    currentPosition: position
                }
            });
        }else{
            this._onBackIconClick();
        }

    }

    _onSearchActionClick(){

        dismissKeyboard();

        this.setState({
            animating: true
        });

        this._getSuggestionList();
    }

    _getSuggestionList(){
        navigator.geolocation.getCurrentPosition(position => {
            if (position && position.coords) {
                (async() => {
                    const cityCode = await getCurrentCityName(position.coords.longitude, position.coords.latitude);
                    console.log('@@@@ cityCode ', cityCode);

                    const suggestionList = await getSuggestionList(this.state.searchString, cityCode);
                    console.log('@@@@ suggestionList', suggestionList);

                    this._handleResponce(suggestionList);
                })();

            }
        }, error => {
            this.setState({
                animating: false
            });
            console.log('@@@@ error while get position ', error);
        }, {
            enableHighAccuracy: true,
            timeout: 20000,
            maximumAge: 1000
        });
    }

    _handleResponce(responceJson){
        this.setState({
            animating: false
        });

        if(responceJson && responceJson.length > 0 ){
            this.setState({ds:this.state.ds.cloneWithRows(responceJson)});
        }else {
            // Alert.alert("提示","没有符合您的查询条件的地点",[{text:'取消',onPress:()=> console.log('@@取消')},
            //     {text:'确定',onPress:()=>console.log('@@确定')}])
        }
    }
    //不清除历史数据
    _onClickNoClearHistory(){

    }
    //清除历史数据
    _onClickClearHistory(){
        console.log('_onClickClearHistory');
        this.setState({
            historyAddressList:[],
            ds: new ListView.DataSource({
            rowHasChanged:(row1, row2)=>row1 !== row2,})
        });

        // 删除单个数据
        storage.remove({
            key: this.state.userMobile,
            id: 'search'
        });

        this.forceUpdate();
    }

    _changeFontColor(content){

        const text = this.state.searchString.toUpperCase();
        if(text && text.length > 0){
            const textStr = content.toUpperCase().split(text);

            let pages =[];
            pages.push(
              <View key={0} style={{flexDirection:'row',justifyContent:'flex-start'}}>
                  <Text  style={styles.unmate_text}>{textStr[0]}</Text>
              </View>
            );

            if(textStr.length > 1){
                for (let i = 1; i < textStr.length; i ++) {
                    pages.push(
                      <View key={i} style={{flexDirection:'row',justifyContent:'flex-start'}}>
                          <Text style={styles.mate_text}>{text}</Text>
                          <Text style={styles.unmate_text}>{textStr[i]}</Text>

                      </View>
                    );
                }
            }

            return(
              <View style={{flex: 1,flexDirection:'row',justifyContent:'flex-start',marginLeft:40}}>
                  {pages}
              </View>
            )

        }else {
            return(
              <View style={{flex: 1,flexDirection:'row',justifyContent:'flex-start',marginLeft:40}}>
                  <Text style={styles.unmate_text}>{content}</Text>
              </View>
            )
        }

    }

}

const styles = StyleSheet.create({
    container: {
        marginTop:64,
        backgroundColor:'rgb(248,248,248)',
        flex: 1,
        flexDirection:'column',
        justifyContent:'center'
    },
    row: {
        height:0.09*height,
        flexDirection:'column',
        justifyContent:'center',
        backgroundColor:'rgb(255,255,255)'
    },
    upview: {
        margin:10,
        flexDirection:'row'
    },
    right_text_up: {
        fontSize:16,
        textAlign:'left',
        margin:20
    },
    mate_text: {
        fontSize:16,
        textAlign:'left',
        marginTop:20,
        color:'blue'
    },
    unmate_text: {
        fontSize:16,
        textAlign:'left',
        marginTop:20
    },
    buttonView: {
        height:height,
        backgroundColor: 'rgb(248,248,248)',
        flexDirection:'column',
        justifyContent:'flex-start',
        alignItems: 'center'
    },
    clear_button: {
        borderWidth:1,
        borderColor:'rgb(115,143,254)',
        borderRadius: 2,
        marginTop:10,
        width:0.7*width,
        height: 38,
        flexDirection:'column',
        justifyContent:'center',
        marginTop: 20
    },
    button_text: {
        fontSize:14,
        textAlign:'center',
        color:'rgb(115,143,254)'
    },
    header: {
        backgroundColor: '#7592FB',
        paddingTop: 0,
        top: 0,
        ...Platform.select({
            ios: {
                height: 64
            },
            android: {
                height: 54
            }
        }),
        right: 0,
        left: 0,
        position: 'absolute',
        flex: 1,
        flexDirection: 'row'
    },
    menuButton: {
        ...Platform.select({
            ios: {
                marginTop: 20
            }
        }),
        width: 33,
        height: 44,
        paddingLeft: 10,
        paddingTop: 9
    },
    searchWrapper: {
        width: width - 105,
        flexDirection: 'row',
        justifyContent: 'center'
    },
    searchInput: {
        top: 27,
        height: 30,
        width: width - 105,
        borderColor: 'gray',
        borderWidth: 0,
        borderRadius: 15,
        backgroundColor:'white',
        fontSize: 14,
        paddingLeft: 12
    },
    type_button: {
        top: 0,
        height: 26,
        width: 180,
        borderWidth: 0,
        borderRadius: 12
    },
    actionButton: {
        ...Platform.select({
            ios: {
                marginTop: 20
            }
        }),
        top:8,
        height: 26,
        // paddingLeft: 8,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    centering: {
        position: 'absolute',
        left: width / 2 - 10,
        top: height / 2 - 60
    }

});

SearchHistoryListContainer.propTypes = {
    dispatch: PropTypes.func,
    currentPosition: PropTypes.object
};

function mapStateToProps(state){
    return {
        currentPosition: state.getIn(['station', 'currentPosition']) ? state.getIn(['station', 'currentPosition']).toJSON() : null
    };
}
module.exports = connect(mapStateToProps)(SearchHistoryListContainer);
