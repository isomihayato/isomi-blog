import { AxiosResponse } from 'axios';
import AxiosWrapper from './axios';
import { InfomationDTO } from '../types/InfomationTypes';
import { ResFunction, ErrFunction } from '../types/CommonTypes';

export function postInfomation(
  data: InfomationDTO,
  cb: ResFunction,
  err: ErrFunction,
) {
  AxiosWrapper({
    method: 'post',
    url: '/infomations',
    data: data,
    callback: (res: AxiosResponse<unknown, object>) => {
      cb(res);
    },
    errors: (res: object) => {
      err(res);
    },
  });
}
export function updateInfomation(
  id: number,
  data: InfomationDTO,
  cb: ResFunction,
  err: ErrFunction,
) {
  AxiosWrapper({
    method: 'PATCH',
    url: `/infomations/${id}`,
    data: data,
    callback: (res: AxiosResponse<unknown, object>) => {
      cb(res);
    },
    errors: (res: object) => {
      err(res);
    },
  });
}
export function deleteInfomation(
  id: number,
  cb: ResFunction,
  err: ErrFunction,
) {
  AxiosWrapper({
    method: 'DELETE',
    url: `/infomations/${id}`,
    data: '',
    callback: (res: AxiosResponse<unknown, object>) => {
      cb(res);
    },
    errors: (res: object) => {
      err(res);
    },
  });
}

export function getShowByBar(cb: ResFunction, err: ErrFunction) {
  AxiosWrapper({
    method: 'GET',
    url: '/infomations/show_by_bar',
    data: '',
    callback: (res: AxiosResponse<unknown, object>) => {
      cb(res);
    },
    errors: (res: object) => {
      err(res);
    },
  });
}
