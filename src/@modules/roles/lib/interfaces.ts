import { IBaseEntity, IBaseResponse } from '@base/interfaces';

export interface IRole extends IBaseEntity {
  name: string;
}

export interface IRolesResponse extends IBaseResponse {
  data: IRole[];
}

export interface IRoleCreate {
  name: string;
  is_active: string;
}
