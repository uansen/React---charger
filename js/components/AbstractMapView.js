import { Platform } from 'react-native';
import { MapView } from 'react-native-maps';
//import GoogleMapView from 'react-native-maps';

let view;
if(Platform.OS === 'ios') {
  view = MapView;
}else{
  view = MapView; // GoogleMapView;
}

export default view;
