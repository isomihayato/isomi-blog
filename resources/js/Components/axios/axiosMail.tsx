import AxiosWrapper from './axios';
import { ResFunction, ErrFunction } from '../types/CommonTypes';
import { AxiosResponse } from 'axios';
import { MailType } from '../types/MailTypes';

export function postSendMail(
  data: MailType,
  cb: ResFunction,
  err: ErrFunction,
) {
  AxiosWrapper({
    method: 'post',
    url: '/send_email',
    data: data,
    callback: (res: AxiosResponse<unknown, object>) => {
      cb(res);
    },
    errors: (res: object) => {
      err(res);
    },
  });
}
