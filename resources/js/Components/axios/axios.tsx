import axios, { AxiosResponse, Method } from 'axios';

type WrapperType = {
  method: Method 
  url: string 
  data: any
  callback: (response: AxiosResponse<any>) => void
  errors: (error: any) => void
}
type AxiosType = {
  method: Method 
  url: string 
  data: any
}
export default function AxiosWrapper(props: WrapperType) {
  const { method, url, data, callback, errors } = props
  axios.defaults.baseURL = 'http://localhost';
  axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';
  axios({
    method: method,
    url: url, 
    data: data,
    withCredentials: true,
    headers:{
      'SameSite': 'None',
      'Content-Type': 'multipart/form-data',
      'Secure': true
    }
  })
    .then((response) => {
      callback(response)
      console.log(response);
    })
    .catch((error) => {
      console.error(error)
      errors(error)
    })
}

export async function axiosAwait(props: AxiosType) {
  const { method, url, data } = props
  axios.defaults.baseURL = 'http://localhost';
  axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';
  axios.defaults.headers.common['SameSite'] = 'None';
  axios.defaults.headers.common['Secure'] = true;

  if (method == 'GET') {
    try {
      const response = await axios.get(url);
      console.log(response);
      return response.data;
    } catch (error) {
      console.error(error);
      // POSTリクエストが失敗した場合の処理
    }  
  }else if(method == 'PATCH'){
    try {
      const response = await axios.post(url, data,{headers:{'Content-Type': 'multipart/form-data'}, method: 'PATCH'});
      console.log(response);
      return response.data;
      // POSTリクエストが成功した場合の処理
    } catch (error) {
      console.error(error);
      // POSTリクエストが失敗した場合の処理
    }
  }else{
    try {
      const response = await axios.post(url, data,{headers:{'Content-Type': 'multipart/form-data'}});
      console.log(response);
      return response.data;
      // POSTリクエストが成功した場合の処理
    } catch (error) {
      console.error(error);
      // POSTリクエストが失敗した場合の処理
    }
  }
  return null;

}
AxiosWrapper.defaultProps = {
  errors: () => {},
}
