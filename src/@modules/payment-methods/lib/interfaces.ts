import { IBaseEntity, IBaseFilter, IBaseResponse } from '@base/interfaces';
import { TPaymentMethodReferenceType, TPaymentMethodType } from './enums';

export interface IPaymentMethodsFilter extends IBaseFilter {
  type?: TPaymentMethodType;
  reference_type?: TPaymentMethodReferenceType;
  is_default?: string;
}

export interface IPaymentMethod extends IBaseEntity {
  name: string;
  image: string;
  type: TPaymentMethodType;
  reference_type: TPaymentMethodReferenceType;
  description: string;
  is_default: boolean;
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
  is_default: string;
  is_active: string;
}
