import LatLng from './LatLng';

export default class LatLngBounds{
  constructor(ne, sw){
    this.ne_ = new LatLng(ne.lat_, ne.lng_);
    this.sw_ = new LatLng(sw.lat_, sw.lng_);
  }

  getNorthEast(){
    return this.ne_;
  }

  getSouthWest(){
    return this.sw_;
  }

  extend(pos){
    if (pos.lat_ < this.sw_.lat_) {
      this.sw_ = new LatLng(pos.lat_, this.sw_.lng_);
    }
    if (pos.lng_ < this.sw_.lng_) {
      this.sw_ = new LatLng(this.sw_.lat_, pos.lng_);
    }
    if (pos.lat_ > this.ne_.lat_) {
      this.ne_ = new LatLng(pos.lat_, this.ne_.lng_);
    }
    if (pos.lng_ > this.ne_.lng_) {
      this.ne_ = new LatLng(this.ne_.lat_, pos.lng_);
    }
  }

  contains(pos){
    return (
      (pos.lat_ <= this.ne_.lat_ && pos.lat_ >= this.sw_.lat_)
      && (pos.lng_ <= this.ne_.lng_ && pos.lng_ >= this.sw_.lng_)
    );
  }
}