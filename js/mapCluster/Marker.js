import LatLng from './LatLng';

export default class Marker{
  constructor(info, pos){
    this.info_ = info;
    this.pos_ = new LatLng(pos.lat(), pos.lng());
  }

  getPosition(){
    return this.pos_;
  }

  getInfo(){
    return this.info_;
  }
}