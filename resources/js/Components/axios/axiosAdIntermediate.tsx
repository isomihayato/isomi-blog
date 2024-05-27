import AxiosWrapper from './axios';

export default function postAdvertisements(data: any, cb: any, err: any) {
  AxiosWrapper({
    method: 'post',
    url: '/ad_intermediates',
    data: data,
    callback: (res: any) => {
      cb(res);
    },
    errors: (res: any) => {
      err(res);
    },
  });
}

export function updateAdvertisements(data: any, cb: any, err: any) {
  AxiosWrapper({
    method: 'post',
    url: '/ad_intermediates/update',
    data: data,
    callback: (res: any) => {
      cb(res);
    },
    errors: (res: any) => {
      err(res);
    },
  });
}
