import { IBaseEntity, IBaseFilter, IBaseResponse } from '@base/interfaces';
import { TPageType } from './enums';

export interface IPagesFilter extends IBaseFilter {
  type?: TPageType;
}

export interface IPage extends IBaseEntity {
  type: TPageType;
  content: string;
}

export interface IPagesResponse extends IBaseResponse {
  data: IPage[];
}

export interface IPageCreate {
  type: TPageType;
  content: string;
  is_active: string;
}
