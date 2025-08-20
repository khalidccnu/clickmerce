import { IBaseEntity, IBaseFilter, IBaseResponse, TId } from '@base/interfaces';

export interface IUsersFilter extends IBaseFilter {}

export interface IUser extends IBaseEntity {
  name: string;
  phone_code: string;
  phone: string;
  email: string;
  is_admin: boolean;
  user_info: {
    birthday: string;
    blood_group: string;
  };
  user_roles: ({ role_id: TId; user_id: TId } & IBaseEntity)[];
}

export interface IUsersResponse extends IBaseResponse {
  data: IUser[];
}

export interface IUserCreate {
  name: string;
  password: string;
  phone_code: string;
  phone: string;
  email: string;
  birthday: string;
  blood_group: string;
  roles: { id?: TId; is_deleted?: boolean }[];
  is_admin: string;
  is_active: string;
}
