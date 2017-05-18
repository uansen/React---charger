export default class LatLng {
  constructor(lat, lng){
    this.lat_ = lat;
    this.lng_ = lng;
  }

  lat(){
    return this.lat_;
  }

  lng(){
    return this.lng_;
  }
}