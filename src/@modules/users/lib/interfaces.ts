import { IBaseEntity, IBaseFilter, IBaseResponse, TId } from '@base/interfaces';
import { IRole } from '@modules/roles/lib/interfaces';

export interface IUsersFilter extends IBaseFilter {
  blood_group?: string;
  is_admin?: string;
  is_default_customer?: string;
  is_system_generated?: string;
  is_verified?: string;
}

export interface IUserCourierHealth {
  couriers: Record<
    string,
    {
      total: number;
      delivered: number;
      rating: string;
      failed: number;
      success_rate: number;
      status: string;
      error: string;
    }
  >;
  summary: {
    total: number;
    delivered: number;
    failed: number;
    success_rate: number;
  };
}

export interface IUserInfo extends IBaseEntity {
  birthday: string;
  blood_group: string;
  balance: number;
  user_id: TId;
}

export interface IUser extends IBaseEntity {
  name: string;
  phone: string;
  email: string;
  is_admin: boolean;
  is_default_customer: boolean;
  is_system_generated: boolean;
  is_verified: boolean;
  user_info: IUserInfo;
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
  is_system_generated: string;
  is_verified: string;
  is_active: string;
}
