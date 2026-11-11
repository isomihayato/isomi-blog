import axios, { AxiosResponse, Method } from 'axios';

type WrapperType<T = unknown> = {
  method: Method;
  url: string;
  data: T;
  callback: (response: AxiosResponse<T>) => void;
  errors: (error: object) => void;
  contentType?: string;
  headers?: Record<string, string>;
};
type AxiosType<T = unknown> = {
  method: Method;
  url: string;
  data: T;
};
export default function AxiosWrapper(props: WrapperType) {
  const { method, url, data, callback, errors, contentType, headers } = props;
  // 接続先は指定せず、ページと同じドメインに送る(本番・ローカルとも設定不要)
  axios({
    method: method,
    url: url,
    data: data,
    withCredentials: true,
    headers: {
      'Content-Type': contentType ? contentType : 'application/json',
      ...headers,
    },
  })
    .then((response) => {
      callback(response);
    })
    .catch((error) => {
      console.error(error);
      errors(error);
    });
}

export async function axiosAwait(props: AxiosType) {
  const { method, url, data } = props;
  // 接続先は指定せず、ページと同じドメインに送る(本番・ローカルとも設定不要)
  if (method == 'GET') {
    try {
      const response = await axios.get(url);

      return response.data;
    } catch (error) {
      console.error(error);
      // POSTリクエストが失敗した場合の処理
    }
  } else if (method == 'PATCH') {
    try {
      const response = await axios.post(url, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
        method: 'PATCH',
      });

      return response.data;
      // POSTリクエストが成功した場合の処理
    } catch (error) {
      console.error(error);
      // POSTリクエストが失敗した場合の処理
    }
  } else {
    try {
      const response = await axios.post(url, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

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
};
