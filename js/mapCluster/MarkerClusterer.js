import LatLng from './LatLng';
import Cluster from './Cluster';
import {distanceBetweenPoints} from './distance';

/**
 * Converts a LatLng to a point of x,y in pixels
 *
 * @param {LatLng} ltlg The LatLng to be converted
 * @param {number} zoom The zoom level to perform the conversion at.
 * @return The converted x,y in an object.
 * @see http://wiki.openstreetmap.org/wiki/Slippy_map_tilenames#Pseudo-code
 */
function fromLatLngToPixel(ltlg, zoom) {
  var tileSize = 256;
  var n = Math.pow(2.0, zoom);

  var lng = ltlg.lng();

  var lng_rad = lng * Math.PI / 180;
  var lat_rad = ltlg.lat() * Math.PI / 180;

  var tileX = ((lng + 180) / 360) * n;
  var tileY = (1 - (Math.log(Math.tan(lat_rad) + 1.0/Math.cos(lat_rad)) / Math.PI)) * n / 2.0;

  var x = tileX * tileSize;
  var y = tileY * tileSize;

  return {
    x: x,
    y: y
  };
}

/**
 * Converts a point of x,y in pixels to a LatLng
 *
 * @param px The object containing an x and y in pixels to be converted
 * @param {number} zoom The zoom level to perform the conversion at.
 * @return {LatLng} The converted LatLng.
 * @see http://wiki.openstreetmap.org/wiki/Slippy_map_tilenames#Pseudo-code
 */
function fromPixelToLatLng(px, zoom) {
  var tileSize = 256;
  var n = Math.pow(2.0, zoom);

  var x = px.x;
  var y = px.y;

  var tileX = x / tileSize;
  var tileY = y / tileSize;


  var lng = tileX / n * 360.0 - 180.0;

  var lat_rad = Math.atan(Math.sinh(Math.PI * (1 - 2 * tileY / n)));
  var lat = lat_rad * 180.0 / Math.PI;

  return new LatLng(lat, lng);
}

/**
 * @name MarkerClustererOptions
 * @class This class represents the optional parameter passed to
 *  the {@link MarkerClusterer} constructor.
 * @property {number} [gridSize=60] The grid size of a cluster in pixels. The grid is a square.
 * @property {number} [zoom=9] The zoom level to calculate clusters at.
 */
export default class MarkerClusterer{
  /**
   * Creates a MarkerClusterer object with the options specified in {@link MarkerClustererOptions}.
   * @constructor
   * @param {Array.<Marker>} The markers to be added to the cluster.
   * @param {MarkerClustererOptions} The optional parameters.
   */
  constructor(markers, options){
    this.markers_ = markers;
    this.gridSize_ = options.gridSize || 60;
    this.zoom_ = options.zoom || 9;
    this.clusters_ = [];
  }

  /**
   * Returns the current bounds extended by the grid size.
   * Does mutate the bounds object passed in.
   *
   * @param {LatLngBounds} bounds The bounds to extend.
   * @return {LatLngBounds} The extended bounds.
   * @ignore
   */
  getExtendedBounds(bounds){
    // Convert the points to pixels and the extend out by the grid size.
    const trPix = fromLatLngToPixel(bounds.getNorthEast(), this.zoom_);
    trPix.x += this.gridSize_;
    trPix.y -= this.gridSize_;

    const blPix = fromLatLngToPixel(bounds.getSouthWest(), this.zoom_);
    blPix.x -= this.gridSize_;
    blPix.y += this.gridSize_;

    // Convert the pixel points back to LatLng
    const ne = fromPixelToLatLng(trPix, this.zoom_);
    const sw = fromPixelToLatLng(blPix, this.zoom_);

    bounds.extend(ne);
    bounds.extend(sw);

    return bounds;
  }

  /**
   * Adds a marker to a cluster, or creates a new cluster.
   *
   * @param {Marker} marker The marker to add.
   */
  addToClosestCluster_(marker){
    var i, d, cluster, center;
    var distance = 40000; // Some large number
    var clusterToAddTo = null;
    for (i = 0; i < this.clusters_.length; i++) {
      cluster = this.clusters_[i];
      center = cluster.getCenter();
      if (center) {
        d = distanceBetweenPoints(center, marker.getPosition());
        if (d < distance) {
          distance = d;
          clusterToAddTo = cluster;
        }
      }
    }

    if (clusterToAddTo && clusterToAddTo.isMarkerInClusterBounds(marker)) {
      clusterToAddTo.addMarker(marker);
    } else {
      cluster = new Cluster(this);
      cluster.addMarker(marker);
      this.clusters_.push(cluster);
    }
  }

  createClusters(){
    let i, marker;
    const start = new Date().valueOf();

    const iLast = this.markers_.length;

    let percentComplete = 0;

    for (i = 0; i < iLast; i++) {
      marker = this.markers_[i];
      if (!marker.isAdded) {
        this.addToClosestCluster_(marker);
      }

      var n = ((i * 100 / iLast) / 10)|0;

      if (n > percentComplete) {
        percentComplete = n;
      }
    }
    console.log('@@@@@ clustering ' + this.markers_.length + ' points took ' + (new Date().valueOf() - start) + ' ms');
    return this.clusters_;
  }
}