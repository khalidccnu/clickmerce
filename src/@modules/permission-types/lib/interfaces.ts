import { IBaseEntity, IBaseResponse } from '@base/interfaces';

export interface IPermissionType extends IBaseEntity {
  name: string;
}

export interface IPermissionTypesResponse extends IBaseResponse {
  data: IPermissionType[];
}

export interface IPermissionTypeCreate {
  name: string;
  is_active: string;
}
