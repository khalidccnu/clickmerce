import { IBaseEntity, IBaseFilter, IBaseResponse } from '@base/interfaces';

export interface IDeliveryServiceTypesFilter extends IBaseFilter {}

export interface IDeliveryServiceType extends IBaseEntity {
  name: string;
  amount: number;
}

export interface IDeliveryServiceTypesResponse extends IBaseResponse {
  data: IDeliveryServiceType[];
}

export interface IDeliveryServiceTypeCreate {
  name: string;
  amount: number;
  is_active: string;
}
