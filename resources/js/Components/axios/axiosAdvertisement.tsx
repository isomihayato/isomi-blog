import { ErrFunction, ResFunction } from '../types/CommonTypes';
import AxiosWrapper from './axios';

export function postAdvertisement(
  data: { article_id: number },
  cb: ResFunction,
  err: ErrFunction,
) {
  AxiosWrapper({
    method: 'post',
    url: '/advertisements',
    data: data,
    callback: (res) => {
      cb(res);
    },
    errors: (res) => {
      err(res);
    },
  });
}
