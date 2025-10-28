import { IBaseEntity, IBaseFilter, IBaseResponse } from '@base/interfaces';

export interface IFeaturesFilter extends IBaseFilter {}

export interface IFeature extends IBaseEntity {
  image: string;
  title: string;
  description: string;
}

export interface IFeaturesResponse extends IBaseResponse {
  data: IFeature[];
}

export interface IFeatureCreate {
  image: string;
  title: string;
  description: string;
  is_active: string;
}
