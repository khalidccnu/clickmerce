import { IBaseEntity, IBaseFilter, IBaseResponse } from '@base/interfaces';

export interface ISuppliersFilter extends IBaseFilter {}

export interface ISupplier extends IBaseEntity {
  name: string;
  phone: string;
  email: string;
  address: string;
}

export interface ISuppliersResponse extends IBaseResponse {
  data: ISupplier[];
}

export interface ISupplierCreate {
  name: string;
  phone: string;
  email: string;
  address: string;
  is_active: string;
}
