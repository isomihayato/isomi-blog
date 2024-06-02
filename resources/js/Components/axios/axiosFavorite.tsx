import { ErrFunction, ResFunction } from '../types/CommonTypes';
import AxiosWrapper, { axiosAwait } from './axios';

export function getFavoritesCount(
  article_id: string,
  cb: ResFunction,
  cbErr: ErrFunction,
) {
  AxiosWrapper({
    method: 'get',
    url: `/favorites?article_id=${article_id}`,
    data: '',
    callback: (res) => {
      cb(res);
    },
    errors: (res) => {
      cbErr(res);
    },
  });
}
export function postFavorite(
  data: { article_id: number },
  cb: ResFunction,
  cbErr: ErrFunction,
) {
  AxiosWrapper({
    method: 'post',
    url: '/favorites',
    data: data,
    callback: (res) => {
      cb(res);
    },
    errors: (res) => {
      cbErr(res);
    },
  });
}

export function deleteFavorite(
  id: number,
  cb: ResFunction,
  cbErr: ErrFunction,
) {
  AxiosWrapper({
    method: 'delete',
    url: `/favorites/${id}`,
    data: '',
    callback: (res) => {
      cb(res);
    },
    errors: (res) => {
      cbErr(res);
    },
  });
}
