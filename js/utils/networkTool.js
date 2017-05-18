/**
 * Created by syl on 16/9/20.
 */
import React from 'react'
import {NetInfo} from 'react-native'

const NO_NETWORK = "network error";
const TAG_NETWORK_CHANGE = "network change";

/***
 * 检查网络连接状态
 * @param callback
 */

const cheackNetWorkState = (callback)=> {
    NetInfo.isConnected.fetch().done(
        (isConnected)=>{
            callback(isConnected);
        }
    )
}
/***
 * 移除网络状态变化监听
 * @param tag
 * @param handler
 */
const removeEventListener = (tag, handler)=>{
    NetInfo.isConnected.removeEventListener(tag,handler);
}
/***
 * 添加网络监听
 * @param tag
 * @param handler
 */
const addEventListener = (tag, handler)=>{
    NetInfo.isConnected.addEventListener(tag,handler);
}

