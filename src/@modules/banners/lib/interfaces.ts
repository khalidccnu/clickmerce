import { IBaseEntity, IBaseFilter, IBaseResponse } from '@base/interfaces';

export interface IBannersFilter extends IBaseFilter {}

export interface IBanner extends IBaseEntity {
  name: string;
  url: string;
  image: string;
}

export interface IBannersResponse extends IBaseResponse {
  data: IBanner[];
}

export interface IBannerCreate {
  name: string;
  url: string;
  image: string;
  is_active: string;
}
