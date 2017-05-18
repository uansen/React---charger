import constants from './constants';

let currentUserId = null;
/**
 * 设置当前用户id
 * @param uid
 */
export function setCurrentUserId(uid){
   currentUserId = uid;
}

/**
 * 根据请求参数计算签名
 * @param url
 * @returns {string}
 */
function getSignature(url){
  return 'blabla';
}

export async function fetchJson( url ){
  try{
    console.log('@@@ url ' , url);
    const postHeader = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    if(currentUserId){
      postHeader['Ev-A'] = currentUserId;
      postHeader['Ev-Sign'] = getSignature(url);
    }

    let response =  await fetch( url , {
      method: 'GET',
      headers:postHeader,
      body: null
    });
    let responseJson = await response.json();
    console.log('@@@@ response json ', responseJson);
    if(responseJson && responseJson.code){
      if(responseJson.code === '10000'){
        return responseJson.data;
      }else{
        throw responseJson;
      }
    }else{
      throw responseJson;
    }
  }catch( error ){
    console.log('@@@ error ' , error);
    throw error;
  }
};


export async function postJson(url, params) {
  try {
    console.log('@@@ url ' , url);
    console.log('@@@ params ' , params);

    const postHeader = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };
    if(currentUserId){
      postHeader['Ev-A'] = currentUserId;
    }
    postHeader['Ev-Sign'] = getSignature(url);

    let  response = await fetch (url, {
      method: 'POST',
      headers: postHeader,
      body: JSON.stringify(
        params
      )
    });
      let responseJson = await response.json();
      console.log('@@@@ response json ', responseJson);
      if(responseJson && responseJson.code){
        if(responseJson.code === '10000'){
          return responseJson.data;
        }else{
          throw responseJson;
        }
      }else{
        throw response;
      }
    }catch( error ){
        console.log('@@@ error ' , error);
        throw error;
      }
};