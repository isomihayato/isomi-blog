import AxiosWrapper from './axios';
import { AxiosResponse } from 'axios';
import { ResFunction, ErrFunction } from '../types/CommonTypes';

export function postArticleImg(
  data: object,
  cb: ResFunction,
  cbErr?: ErrFunction,
) {
  AxiosWrapper({
    method: 'post',
    url: '/articles/uploadImg',
    data: data,
    callback: (res: AxiosResponse<unknown, object>) => {
      cb(res);
    },
    errors: (res: object) => {
      cbErr(res);
    },
    contentType: 'multipart/form-data',
  });
}

export function postArticle(data: ResFunction, cb: ErrFunction) {
  AxiosWrapper({
    method: 'post',
    url: '/articles',
    data: data,
    callback: (res: AxiosResponse<unknown, object>) => {
      cb(res);
    },
    errors: (res: object) => {
      cb(res);
    },
  });
}

export function updateArticle(
  article_id: number,
  data: ResFunction,
  cb: ErrFunction,
) {
  AxiosWrapper({
    method: 'post',
    url: '/articles/update/' + article_id,
    data: data,
    callback: (res: AxiosResponse<unknown, object>) => {
      cb(res);
    },
    errors: (res: object) => {
      cb(res);
    },
  });
}

export function getSearchArticle(searchTerm: string, cb: ErrFunction) {
  AxiosWrapper({
    method: 'get',
    url: `/articles/search?search=${searchTerm}`,
    data: '',
    callback: (res: AxiosResponse<unknown, object>) => {
      cb(res);
    },
    errors: (res: object) => {
      cb(res);
    },
  });
}
