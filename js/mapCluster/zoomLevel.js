import { diagonalDistanceOfRegion } from '../mapCluster/distance';
import LatLng from '../mapCluster/LatLng';

export default function getZoomLevel(region){
  const distance = diagonalDistanceOfRegion(region);

  if(distance >= 14000){
    return 0;
  }else if(distance < 14000 && distance >= 8000){
    return 1;
  }else if(distance < 8000 && distance >= 5000){
    return 2;
  }else if(distance < 5000 && distance >= 3500){
    return 3;
  }else if(distance < 3500 && distance >= 2800){
    return 4;
  }else if(distance < 2800 && distance >= 1800){
    return 5;
  }else if(distance < 1800 && distance >= 1000){
    return 6;
  }else if(distance < 1000 && distance >= 650){
    return 7;
  }else if(distance < 650 && distance >= 400){
    return 8;
  }else if(distance < 400 && distance >= 260){
    return 9;
  }else if(distance < 260 && distance >= 170){
    return 10;
  }else if(distance < 170 && distance >= 80){
    return 11;
  }else if(distance < 80 && distance >= 50){
    return 12;
  }else if(distance < 50 && distance >= 18){
    return 13;
  }else if(distance < 18 && distance >= 10){
    return 14;
  }else if(distance < 10 && distance >= 6.5){
    return 15;
  }else if(distance < 6.5 && distance >= 3.8){
    return 16;
  }else if(distance < 3.8 && distance >= 2.2){
    return 17;
  }else if(distance < 2.2 && distance >= 1){
    return 18;
  }else if(distance < 1 && distance >= 0.5){
    return 19;
  }else if(distance < 0.5){
    return 20;
  }
}