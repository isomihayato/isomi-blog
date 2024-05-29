import { ArticleAdType } from '../types/ArticleAdTypes';
import { ErrFunction, ResFunction } from '../types/CommonTypes';
import AxiosWrapper from './axios';
import { AxiosResponse } from 'axios';

export default function postArticleAd(
  data: ArticleAdType,
  cb: ResFunction,
  errors: ErrFunction,
) {
  AxiosWrapper({
    method: 'post',
    url: '/article_ads',
    data: data,
    callback: (res) => {
      cb(res);
    },
    errors: (res) => {
      errors(res);
    },
  });
}

export function putArticleAd(
  data: ArticleAdType,
  cb: ResFunction,
  errors: ErrFunction,
) {
  const url = '/article_ads/' + data.id;

  AxiosWrapper({
    method: 'patch',
    url: url,
    data: data,
    callback: (res) => {
      cb(res);
    },
    errors: (res) => {
      errors(res);
    },
  });
}

export function deleteArticleAd(
  id: number,
  cb: ResFunction,
  errors: ErrFunction,
) {
  AxiosWrapper({
    method: 'DELETE',
    url: `/article_ads/${id}`,
    data: null,
    callback: (res: AxiosResponse<unknown, object>) => {
      cb(res);
    },
    errors: (res: object) => {
      errors(res);
    },
  });
}

export function getAdSelectData(cb: ResFunction, errors: ErrFunction) {
  AxiosWrapper({
    method: 'get',
    url: '/get_ad_select',
    data: null,
    callback: (res) => {
      cb(res);
    },
    errors: (res) => {
      errors(res);
    },
  });
}
