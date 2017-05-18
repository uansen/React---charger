/**
 * Created by syl on 16/8/26.
 */
import React, {Component, PropTypes} from 'react';
import {StyleSheet, Text, View, TouchableHighlight, Dimensions, ListView, ScrollView,Platform,ActivityIndicator,TouchableOpacity,NetInfo,Animated} from 'react-native';
import { connect } from 'react-redux';
import HearderNavi from '../../components/HearderNavi'
import {Actions} from 'react-native-router-flux';
import CustomButton from '../../components/CustomButton'
import Icon from 'react-native-vector-icons/Ionicons';
import SeparateLine from '../../components/SeparateLine';
import {getBillList,getBillDetail} from '../../actions/billAction';
import PullToRefreshListView from 'react-native-smart-pull-to-refresh-listview';
import TimerEnhance from 'react-native-smart-timer-enhance';
import NoBillView from '../../components/NoBillView';
import BillNetErrorView from '../../components/BillNetErrorView';
import i18n from '../../utils/i18n';

function stringToTime(string) {
    return new Date(parseInt(string)).toLocaleString().replace(/:\d{1,2}$/,' ');
}
function stringFormatToTime(string) {
    return new Date(parseInt(string)).toLocaleDateString().replace(/:\d{1,2}$/,' ').substr(2);
}

function monthFormatToTime(string) {
    return new Date(parseInt(string)).getMonth() + 1;
}

const PAGE_SIZE = 9;

const width = Dimensions.get('window').width;
const _month = {
    '1': i18n.JANUARY,
    '2': i18n.FEBRUARY,
    '3':i18n.MARCH,
    '4':i18n.APRIL,
    '5':i18n.MAY,
    '6':i18n.JUNE,
    '7':i18n.JULY,
    '8':i18n.AUGUST,
    '9':i18n.SEPTEMBER,
    '10':i18n.OCTOBER,
    '11':i18n.NOVEMBER,
    '12':i18n.DECEMBER
};

class BillListContainer extends Component {
    constructor(props){
        super(props);

        const getSectionData = (dataBlob,sectionIndex) => { 
            return dataBlob[sectionIndex];
         }  ;
        const getRowData = (dataBlob ,sectionIndex, rowIndex) => { 
            return dataBlob[sectionIndex + ':' + rowIndex];
         }  ;
        this.state={
            isNoBillList: false,
            isNetError: false, 
            billLists: [],
            billData: [],
            dataSource: new ListView.DataSource({ 
                getSectionData: getSectionData, 
                getRowData: getRowData, 
                rowHasChanged: (row1, row2) => row1 !== row2, 
                sectionHeaderHasChanged: (s1, s2) => s1 !== s2 
            }),
            pageNo: 1,
            billListCount: null,
            isNoMoreData: false,
            disabled: false
        };
    }

    componentDidMount(){
        this._pullToRefreshListView.beginRefresh();
        //this.props.dispatch(getBillList(0, PAGE_SIZE));
    }

    componentWillReceiveProps(nextProps){

        const prvIsFetching = this.props.isFetching;
        const nextIsFetching = nextProps.isFetching;
        const prvIsComplete = this.props.isComplete;
        const nextIsComplete = nextProps.isComplete;

        const billListCount = nextProps.billListCount ? nextProps.billListCount : 1;
        const currentPageNo = this.state.pageNo + 1;

        //结束刷新
        if(this._pullToRefreshListView) {
            this.state.pageNo < 1 ? this._pullToRefreshListView.endRefresh() : this._pullToRefreshListView.endLoadMore(this.state.isNoMoreData);

        }

        if (prvIsFetching && !nextIsFetching && !prvIsComplete && nextIsComplete && billListCount >= currentPageNo){

            this.state.pageNo += 1;
            this.state.billListCount = nextProps.billListCount;
            this.setState(this.state);

            if (nextProps.billLists.length > 0){

                const billLists = nextProps.billLists

                //更新数据
                this._updataBillData(this._fromartBillData(billLists));

            }else {

                if(this._pullToRefreshListView) {
                    this._pullToRefreshListView.endLoadMore(true);
                }
                this.setState({
                    isNoBillList: true,
                    isNetError: false
                });
            }
        }else if(!nextIsFetching && !nextIsComplete){

            if(this._pullToRefreshListView) {
                this._pullToRefreshListView.endRefresh();
                this._pullToRefreshListView.endLoadMore(false);
            }

            this.setState({
                isNetError: true,
                isNoBillList: false
            });
        }
    }

    //数据处理
    _fromartBillData(billLists){

        if (this.state.pageNo !== 1){
            billLists = this.state.billLists.concat(billLists);

        }

        const billList = billLists.map(item=>{return {
            month: monthFormatToTime(item.createTime),
            formatTime: stringFormatToTime(item.createTime),
            time: stringToTime(item.createTime),
            cost: item.cost,
            stationName: item.name,
            stationAddress: item.address,
            duration: item.duration,
            prod: item.prod,
            orderId: item.orderId
        }});

        let month = new Set();
        for (let order in billList){
            month.add(billList[order].month);
        }

        let billData = [];
        for (let m of month){
            let orders = [];
            let ordersList = {};
            for (let order in billList){
                if (m === billList[order].month){
                    orders.push(billList[order]);
                }
            }
            ordersList['month'] = m;
            ordersList['orders'] = orders;
            billData.push(ordersList);

        }


        this.state.billLists = billLists;
        this.state.billData = billData;
        this.setState(this.state);
    }

    //更新数据
    _updataBillData(){
        let dataBlob = {},
            sectionIDs = [],
            rowIDs = []

        const billData = this.state.billData;
        for (let i = 0; i < billData.length; i++){
            sectionIDs.push(i);
            dataBlob[i] = billData[i].month;
            orders = billData[i].orders;

            rowIDs[i] = [];
            for(let j=0; j<orders.length;j++){
                rowIDs[i].push(j);
                dataBlob[i+':'+j] = orders[j];
            }
        }
        this.setState({
            isNoMoreData : (this.state.pageNo == this.props.billListCount),
            isNetError: false,
            isNoBillList: false,
            billData: billData,
            dataSource:this.state.dataSource.cloneWithRowsAndSections(dataBlob,sectionIDs,rowIDs)

        });
    }

    render(){
        return(
            <View style={{flex: 1}}>
                <HearderNavi title={i18n.MENU_BILL}/>
                {this._renderContent()}
            </View>
        )
    }

    //渲染数据
    _renderContent(){
        return this.state.isNoBillList || this.state.isNetError ? this._renderTipsView() : this._renderListView();
    }

    _renderListView(){
        return(
            <View style={styles.container}>
              <PullToRefreshListView
                ref={ (component) => this._pullToRefreshListView = component }
                viewType={PullToRefreshListView.constants.viewType.listView}
                enableEmptySections={true}
                dataSource={this.state.dataSource}
                renderRow={this._renderItem.bind(this)}
                renderHeader={this._renderHeader.bind(this)}
                renderFooter={this._renderFooter.bind(this)}
                onRefresh={this._onRefresh.bind(this)}
                onLoadMore={this._onLoadMore.bind(this)}
                pullUpDistance={40}
                pullUpStayDistance={40}
                pullDownDistance={40}
                pullDownStayDistance={40}
                renderSectionHeader={this._renderSectionHeader.bind(this)}
              />
            </View>
        )
    }

    //渲染每一行数据
    _renderItem(rowData, sectionID, rowID){
        return(
             <ScrollView ref={(scrollView)=>{_scrollView = scrollView;}}
                         horizontal={true}
                         showsHorizontalScrollIndicator={false}
                         onScroll={this._onScroll.bind(this)}
                         scrollEventThrottle={0}
                         bounces={false}
                         pagingEnabled={true}>
                <TouchableOpacity style={styles.rowContiner} key={arguments[2]} onPress={()=>this._pressRow(rowData)} disabled={this.state.disabled}>
                    <View style={styles.rowView}>
                        <Text style={styles.leftText}>{rowData.formatTime}</Text>
                        <View style={styles.middleView}>
                            <Text style={styles.upText}>{"HK$" + rowData.cost}</Text>
                            <Text style={styles.downText}>{rowData.stationName}</Text>
                        </View>
                        <View style={styles.rightView}>
                            <Text style={styles.rightText}>{'Pending'}</Text>
                        </View>

                        <TouchableOpacity style={styles.dustbinView} onPress={()=>this._onDelete(rowData)}>
                         <View >
                            <Icon name="ios-trash-outline" size={30} color='white'/>
                         </View>
                        </TouchableOpacity>
                    </View>
                    {this._renderSeparator()}
                 </TouchableOpacity>
             </ScrollView>
        )
    }

    _pressRow(rowData){
        if (rowData) {
            this.props.dispatch(getBillDetail(rowData.cost,rowData.stationName,rowData.stationAddress,rowData.time,rowData.duration,rowData.prod,rowData.orderId));
            Actions.billDetail();
        }
    }

    _onDelete(){
        console.log('@@@@@__onDelete');
    }

    _renderTipsView(){
        if (this.state.isNetError){
            return(
              <TouchableOpacity style={styles.errorView} onPress={()=>this._onRefresh()} >
                  <View >
                      <BillNetErrorView></BillNetErrorView>
                  </View>

              </TouchableOpacity>
            )

        }else {
            return(
                <TouchableOpacity style={styles.errorView} onPress={()=>this._onRefresh()} >
                    <View >
                        <NoBillView></NoBillView>
                    </View>

                </TouchableOpacity>

            )
        }


    }

    _renderSeparator(){
        return(
          <View style={{width:width, backgroundColor:'lightgrey', height:1}}></View>
        )

    }
    _renderSectionHeader(sectionData, sectionID){
        return(
          <View style={styles.header}>
            <Text style={styles.headerText}>{_month[sectionData]}</Text>
          </View>
        )
    }

    _onScroll(e){

        // _scrollView.contentOffset({x: 0, y: 0, animated: true});

        if (e.nativeEvent.contentOffset.x > 0){
            this.setState({
                disabled: true
            });
        }else {
            this.setState({
                disabled: false
            });
        }

    }

    //刷新数据
    _renderHeader = (viewState) => {
        let {pullState, pullDistancePercent} = viewState
        let {refresh_none, refresh_idle, will_refresh, refreshing} = PullToRefreshListView.constants.viewState
        pullDistancePercent = Math.round(pullDistancePercent * 100)
        switch(pullState) {
            case refresh_idle:
                return (
                  <View style={{height: 40, justifyContent: 'center', alignItems: 'center', backgroundColor: '#ffffff',}}>
                      <Text>pull down to refresh {pullDistancePercent}%</Text>
                  </View>
                )
            case will_refresh:
                return (
                  <View style={{height: 40, justifyContent: 'center', alignItems: 'center', backgroundColor: '#ffffff',}}>
                      <Text>release to refresh {pullDistancePercent > 100 ? 100 : pullDistancePercent}%</Text>
                  </View>
                )
            case refreshing:
                return (
                  <View style={{flexDirection: 'row', height: 40, justifyContent: 'center', alignItems: 'center', backgroundColor: '#ffffff',}}>
                      {this._renderActivityIndicator()}<Text>refreshing</Text>
                  </View>
                )
        }
    }

    //加载更多
    _renderFooter = (viewState) => {
        let {pullState, pullDistancePercent} = viewState
        let {load_more_none, load_more_idle, will_load_more, loading_more, loaded_all, } = PullToRefreshListView.constants.viewState
        pullDistancePercent = Math.round(pullDistancePercent * 100);
        switch(pullState) {
            case load_more_none:
                return (
                  <View style={{height: 40, justifyContent: 'center', alignItems: 'center', backgroundColor: '#ffffff',}}>
                      <Text>pull up to load more</Text>
                  </View>
                )
            case load_more_idle:
                return (
                  <View style={{height: 40, justifyContent: 'center', alignItems: 'center', backgroundColor: '#ffffff',}}>
                      <Text>pull up to load more {pullDistancePercent}%</Text>
                  </View>
                )
            case will_load_more:
                return (
                  <View style={{height: 40, justifyContent: 'center', alignItems: 'center', backgroundColor: '#ffffff',}}>
                      <Text>release to load more {pullDistancePercent > 100 ? 100 : pullDistancePercent}%</Text>
                  </View>
                )
            case loading_more:
                return (
                  <View style={{flexDirection: 'row', height: 40, justifyContent: 'center', alignItems: 'center', backgroundColor: '#ffffff',}}>
                      {this._renderActivityIndicator()}<Text>loading</Text>
                  </View>
                )
            case loaded_all:
                return (
                  <View style={{height: 40, justifyContent: 'center', alignItems: 'center', backgroundColor: '#ffffff',}}>
                      <Text>no more</Text>
                  </View>
                )
        }
    }


    //正在刷新数据
    _onRefresh = () => {
        this.setState({
            pageNo : 0
        });
        this.props.dispatch(getBillList(1, PAGE_SIZE));
    }

    //正在加载数据
    _onLoadMore = () => {
        this.props.dispatch(getBillList(this.state.pageNo + 1, PAGE_SIZE));
    }

    _renderActivityIndicator() {
        return ActivityIndicator ? (
          <ActivityIndicator
            style={{marginRight: 10}}
            animating={true}
            color={'black'}
            size={'small'}/>
        ) : Platform.OS === 'android' ?
          (
            <ProgressBarAndroid
              style={{marginRight: 10}}
              color={'black'}
              styleAttr={'Small'}/>

          ) :  (
          <ActivityIndicatorIOS
            style={{marginRight: 10}}
            animating={true}
            color={'black'}
            size={'small'}/>
        )
    }

}

const styles = StyleSheet.create({
    container: {
        flex:1,
        marginTop: 64,
        backgroundColor:'#F8F8F8'
    },
    rowContiner: {
        backgroundColor:'#FFFFFF',
        height:60,
        width:1.2*width,
        flex: 1,
        flexDirection:'column'
    },
    rowView: {
        flex: 1,
        height:50,
        flexDirection:'row',
    },
    leftText: {
        color:'gray',
        fontSize:16,
        textAlign:'left',
        width:0.3*width,
        marginTop: 22,
        marginLeft: 18
    },
    middleView: {
        marginTop:10,
        flexDirection:'column',
        width:0.7*width - 98
    },
    rightView: {
        width:80,
        flexDirection:'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    rightText: {
        color:'rgb(255,144,83)',
        fontSize:14
    },
    upText: {
        color:'black',
        fontSize:18
    },
    downText: {
        marginTop: 5,
        color:'gray',
        fontSize:14
    },
    header: {
        backgroundColor:'#F8F8F8',
        height:40

    },
    headerText: {
        color:'gray',
        fontSize:18,
        margin:10
    },
    dustbinView: {
        backgroundColor:'rgb(255,96,96)',
        flexDirection:'column',
        alignItems:'center',
        justifyContent:'center',
        width:0.2*width
    },
    errorView: {
        marginTop: 64,
        flex: 1,
        flexDirection:'column',
        alignItems:'center',
        justifyContent:'center',
        backgroundColor: 'rgb(248,248,248)'
    }
});


BillListContainer.propTypes = {
    dispatch: PropTypes.func
}

function mapStateToProps(state) {
    //return{
    //    billList:state.getIn(['bill','billLists']).toJSON().map(item=>{return {
    //        time:stringToTime(item.time),
    //        cost:item.cost,
    //        stationName:item.stationName,
    //        stationAddress:item.stationAddress
    //    }})
    //}

    const bill = state.get('bill').toJSON();
    bill.error =  state.getIn(['root', 'error']);
    return bill;
}

module.exports = connect(mapStateToProps)(TimerEnhance(BillListContainer));