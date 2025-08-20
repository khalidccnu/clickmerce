import { IBaseEntity, IBaseFilter, IBaseResponse, TId } from '@base/interfaces';
import { IPermissionType } from '@modules/permission-types/lib/interfaces';

export interface IPermissionsFilter extends IBaseFilter {
  permission_type_id?: TId;
}

export interface IPermission extends IBaseEntity {
  name: string;
  is_already_added: boolean;
  permission_type: IPermissionType;
}

export interface IPermissionsResponse extends IBaseResponse {
  data: IPermission[];
}

export interface IPermissionCreate {
  name: string;
  permission_type_id: TId;
  is_active: string;
}
