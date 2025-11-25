import { IBaseEntity, IBaseFilter, IBaseResponse } from '@base/interfaces';

export interface INoticesFilter extends IBaseFilter {}

export interface INotice extends IBaseEntity {
  name: string;
  url: string;
  content: string;
}

export interface INoticesResponse extends IBaseResponse {
  data: INotice[];
}

export interface INoticeCreate {
  name: string;
  url: string;
  content: string;
  is_active: string;
}
