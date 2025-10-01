import { IBaseEntity, IBaseFilter, IBaseResponse, TId } from '@base/interfaces';
import { IRole } from '@modules/roles/lib/interfaces';

export interface IUsersFilter extends IBaseFilter {
  blood_group?: string;
  is_admin?: string;
  is_default_customer?: string;
}

export interface IUser extends IBaseEntity {
  name: string;
  phone: string;
  email: string;
  is_admin: boolean;
  is_default_customer: boolean;
  user_info: {
    birthday: string;
    blood_group: string;
  };
  user_roles: ({ role_id: TId; user_id: TId; role: IRole } & IBaseEntity)[];
}

export interface IUsersResponse extends IBaseResponse {
  data: IUser[];
}

export interface IUserCreate {
  name: string;
  password: string;
  phone: string;
  email: string;
  birthday: string;
  blood_group: string;
  roles: { id?: TId; is_deleted?: boolean }[];
  is_admin: string;
  is_default_customer: string;
  is_active: string;
}
