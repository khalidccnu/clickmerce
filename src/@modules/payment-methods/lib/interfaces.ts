import { IBaseEntity, IBaseFilter, IBaseResponse } from '@base/interfaces';
import { TPaymentMethodReferenceType, TPaymentMethodType } from './enums';

export interface IPaymentMethodsFilter extends IBaseFilter {}

export interface IPaymentMethod extends IBaseEntity {
  name: string;
  image: string;
  type: TPaymentMethodType;
  reference_type: TPaymentMethodReferenceType;
  description: string;
}

export interface IPaymentMethodsResponse extends IBaseResponse {
  data: IPaymentMethod[];
}

export interface IPaymentMethodCreate {
  name: string;
  image: string;
  type: TPaymentMethodType;
  reference_type: TPaymentMethodReferenceType;
  description: string;
  is_active: string;
}
