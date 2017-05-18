/**
 * Created by syl on 16/8/17.
 */
import React, {Component, PropTypes} from 'react';
import {StyleSheet, Text, TextInput, TouchableHighlight, View, Dimensions, Platform, Switch, TouchableOpacity,} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import Button from 'apsl-react-native-button';

const width = Dimensions.get('window').width;

const styles = StyleSheet.create({
    header: {
        backgroundColor: '#7592FB',
        paddingTop: 0,
        top: 0,
        ...Platform.select({
            ios: {
                height: 64,
            },
            android: {
                height: 54,
            }
        }),
        right: 0,
        left: 0,
        position: 'absolute',
        flex: 1,
        flexDirection: 'row'
    },
    menuButton:{
        ...Platform.select({
            ios: {
                marginTop: 20,
            }
        }),
        width: 44,
        height: 44,
        paddingLeft: 17,
        paddingTop: 7
    },
    searchWrapper:{
        width: width - 100,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    searchInput:{
        top: 30,
        height: 32,
        width: width - 100,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 16,
        backgroundColor:'white',
        fontSize: 14
    },
    type_button:{
        top: 0,
        height: 26,
        width: 180,
        borderWidth: 0,
        borderRadius: 12,
    },
    actionButton:{
        ...Platform.select({
            ios: {
                marginTop: 20,
            }
        }),
        top:10,
        height: 26,
        paddingLeft: 7,
        paddingTop:4,
    },

});

export default class SearchHistoryBar extends Component {
    constructor(props){
        super(props);
        this.state = {
            searchString:'',
        }
    }

    render(){
        return (<View style={styles.header}>
            {this._renderBackIcon()}
            {this._renderSearchInput()}
            {this._renderSearchAction()}
        </View>);
    }

    _renderBackIcon(){
        return (
            <TouchableOpacity underlayColor='#cccccc'
                                style={styles.menuButton} onPress={this._onBackIconClick.bind(this)}>
                <Icon name="ios-arrow-back" size={30}
                      color="white"
                      backgroundColor="#EFEFF2"/>
            </TouchableOpacity>
        )
    }

    _renderSearchInput(){
        return (
            <View style={styles.searchWrapper}>
                <TouchableOpacity onPress={this._onTextAreaClick.bind(this)}>
                    <TextInput style={styles.searchInput } placeholder='   Enter the address' placeholderTextColor='rgb(153,153,153)'
                               editable={!this.props.disabled} onChange={this.onSearchTextChanged.bind(this)} value={this.state.searchString}>
                    </TextInput>
                </TouchableOpacity>

            </View>);
    }

    _renderSearchAction(){
        return (<TouchableOpacity underlayColor='#cccccc'
                                    style={styles.actionButton} onPress={this._onSearchActionClick.bind(this)}>
                <Text style={{color:'white', textAlign:'center'}}>Search</Text>

        </TouchableOpacity>);
    }

    _onBackIconClick() {
        if (this.props.onBackIconClick) {
            this.props.onBackIconClick();
        }
    }
    onSearchTextChanged(event){
        console.log('onSearchTextChanged');
        this.setState({searchString: event.nativeEvent.text});
        console.log(this.state.searchString);
    }

    _onSearchActionClick(){
        if(this.props.onSearchActionClick){
            this.props.onSearchActionClick();
        }
    }

    _onTextAreaClick(){
        if(this.props.disabled && this.props.onTextAreaClicked){
            this.props.onTextAreaClicked();
        }
    }
}

SearchHistoryBar.propTypes = {
    onBackIconClick: PropTypes.func,
    disabled: PropTypes.bool,
    onTextAreaClicked: PropTypes.func,
    onSearchActionClick: PropTypes.func,
    searchString:PropTypes.string,
}
