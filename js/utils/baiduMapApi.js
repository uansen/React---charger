const appKey = 'YVauMylS4letX7VaOeO0lEYr';

/**
 * 根据经纬度获取当前城市名
 * @param longitude
 * @param latitude
 * @returns cityName
 */
export async function getCurrentCityName(longitude, latitude){
  try{
    console.log('@@@@@ long ' + longitude + ' lat '+ latitude);
    let response = await fetch(`http://api.map.baidu.com/geocoder/v2/?location=${latitude},${longitude}&output=json&ak=${appKey}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    let data = await response.json();
    console.log('@@@@@ data ' , data);
    if(data && data.status === 0 && data.result && data.result.addressComponent && data.result.addressComponent.city){
      return data.result.addressComponent.city;
    }else{
      return 0;
    }
  }catch(error){
    console.log('@@@@ error while getCurrentCityName ', error);
    return 0;
  }
}

/**
 * 根据地址和城市编码,获得建议词条
 * @param name
 * @param cityCode
 * @returns {*}
 */
export async function getSuggestionList(name, cityCode){
  if(!name || cityCode <= 0){
    return [];
  }
  try{
    let response = await fetch(`http://api.map.baidu.com/place/v2/suggestion?query=${name}&region=${cityCode}&output=json&ak=${appKey}`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
    let data = await response.json();
    if(data && data.status === 0 && data.result){
      return data.result;
    }else{
      return [];
    }
  }catch(error){
    console.log('@@@@ error while getSuggestionList ', error);
    return [];
  }
}