import LatLng from './LatLng';

/**
 * Calculates the distance between two latlng locations in km.
 *
 * @param {LatLng} p1 The first lat lng point.
 * @param {LatLng} p2 The second lat lng point.
 * @return {number} The distance between the two points in km.
 * @see http://www.movable-type.co.uk/scripts/latlong.html
 */
export function distanceBetweenPoints(p1, p2){
  const R = 6371; // Radius of the Earth in km
  const dLat = (p2.lat() - p1.lat()) * Math.PI / 180;
  const dLon = (p2.lng() - p1.lng()) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(p1.lat() * Math.PI / 180) * Math.cos(p2.lat() * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return d;
}

/**
 * Calculates the distance of the region's diagonal
 * @param region
 */
export function diagonalDistanceOfRegion(region){
  const top = region.latitude + region.latitudeDelta / 2;
  const left = region.longitude - region.longitudeDelta / 2;
  const nw = new LatLng( top > 90 ? 90 : top, left > -180 ? left : -180);

  const bottom = region.latitude - region.latitudeDelta / 2;
  const right = region.longitude + region.longitudeDelta / 2;
  const se = new LatLng(bottom > -90 ? bottom : -90, right < 180 ? right: 180);
  return  distanceBetweenPoints(nw, se);
}