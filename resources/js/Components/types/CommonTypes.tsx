import { AxiosResponse } from 'axios';

export type ResFunction = (res: AxiosResponse<unknown, unknown>) => void;
export type ErrFunction = (error: object) => void;
