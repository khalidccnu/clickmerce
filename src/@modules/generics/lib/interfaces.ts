import { IBaseEntity, IBaseFilter, IBaseResponse } from '@base/interfaces';

export interface IGenericsFilter extends IBaseFilter {}

export interface IGeneric extends IBaseEntity {
  name: string;
  slug: string;
}

export interface IGenericsResponse extends IBaseResponse {
  data: IGeneric[];
}

export interface IGenericCreate {
  name: string;
  slug: string;
  is_active: string;
}
