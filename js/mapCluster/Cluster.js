import LatLng from './LatLng';
import LatLngBounds from './LatLngBounds';

export default class Cluster{
  /**
   * Creates a single cluster that manages a group of proximate markers.
   * Created internally, then returned by the library.
   * @constructor
   * @param {MarkerClusterer} mc The <code>MarkerClusterer</code> object with which this
   *  cluster is associated.
   */
  constructor(mc){
    this.mc_ = mc;
    this.gridSize_ = mc.gridSize_;
    this.markers_ = [];
    this.center_ = null;
    this.bounds_ = null;
  }

  getSize(){
    return this.markers_.length;
  }

  getMarkers(){
    return this.markers_;
  }

  getCenter(){
    return this.center_;
  }

  /**
   * Returns the bounds of the cluster.
   *
   * @return {LatLngBounds} the cluster bounds.
   * @ignore
   */
  getBounds(){
    const bounds = new LatLngBounds((this.center_, this.center_));
    const markers = this.getMarkers();
    markers.forEach(marker => bounds.extend(marker.getPosition()));
    return bounds;
  }

  /**
   * Adds a marker to the cluster.
   *
   * @param {Marker} marker The marker to be added.
   * @return {boolean} True if the marker was added.
   * @ignore
   */
  addMarker(marker){
    if (this.isMarkerAlreadyAdded_(marker)) {
      return false;
    }

    if (!this.center_) {
      this.center_ = marker.getPosition();
      this.calculateBounds_();
    }

    marker.isAdded = true;
    this.markers_.push(marker);

    return true;
  }

  isMarkerInClusterBounds(marker){
    return this.bounds_.contains(marker.getPosition());
  }

  calculateBounds_(){
    this.bounds_ = this.mc_.getExtendedBounds(new LatLngBounds(this.center_, this.center_));
  }

  isMarkerAlreadyAdded_(marker){
    let i = 0;
    if(this.markers_.indexOf){
      return this.markers_.indexOf(marker) !== -1;
    }else{
      for(i = 0; i < this.markers_.length; i++){
        if(marker === this.markers_[i]){
          return true;
        }
      }
    }
    return false;
  }

}