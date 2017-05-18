import React from 'react';
import { Scene, Router, ActionConst } from 'react-native-router-flux';
import { connect } from 'react-redux';

import LoginContainer from './containers/login/LoginContainer';
import MapContainer from './containers/home/MainContainer';
import SearchListContainer from './containers/search/SearchListContainer';
import SearchHistoryListContainer from './containers/search/SearchHistoryListContainer';
import BalanceContainer from './containers/payment/BalanceContainer';
import BillDetailContainer from './containers/payment/BillDetailContainer';
import BillListContainer from './containers/payment/BillListContainer';
import CameraQrContainer from './containers/charge/CameraQrContainer';
import PersonalProfileContainer from './containers/settings/PersonalProfileContainer';
import Name from './containers/settings/NameContainer';
import Settings from './containers/settings/SettingsContainer';
import TopUp from './containers/payment/TopUpContainer';

const RouterWithRedux = connect()(Router);

export default function () {
  return (
    <RouterWithRedux>
      <Scene key="root" hideNavBar hideTabBar>
        <Scene key="login" component={LoginContainer} title="Login" initial type={ActionConst.REPLACE}/>
        <Scene key="main" component={MapContainer} title="Charge Station" type={ActionConst.REPLACE} />
        <Scene key="search" component={SearchListContainer} title="Search List" type={ActionConst.REPLACE}/>
        <Scene key="searchhistory" component={SearchHistoryListContainer} title="Search History" type={ActionConst.REPLACE} />
        <Scene key="balance" component={BalanceContainer} title="Balance" />
        <Scene key="billDetail" component={BillDetailContainer} title="BillDetail" />
        <Scene key="billList" component={BillListContainer} title="BillList" />
        <Scene key="cameraQrContainer" component={CameraQrContainer} title="CameraQrContainer" />
        <Scene key="profile" component={PersonalProfileContainer} title="Basic information" />
        <Scene key="name" component={Name} title="Name" />
        <Scene key="settings" component={Settings} title="Settings" />
        <Scene key="topUp" component={TopUp} title="Top up" />
      </Scene>
    </RouterWithRedux>
  );
}

