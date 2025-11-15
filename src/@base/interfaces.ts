import { IPage } from '@modules/pages/lib/interfaces';
import { ISettingsIdentity } from '@modules/settings/lib/interfaces';
import { IUser } from '@modules/users/lib/interfaces';

export type TId = string | number;

export type TDeepPartial<T> = T extends (...args: any[]) => any
  ? T
  : T extends Array<infer U>
    ? Array<TDeepPartial<U>>
    : T extends object
      ? { [P in keyof T]?: TDeepPartial<T[P]> }
      : T;

export interface IBaseFilter {
  page?: string;
  limit?: string;
  search_term?: string;
  search_field?: string;
  search_fields?: string[];
  is_active?: boolean | string;
  start_date?: string;
  end_date?: string;
  sort_by?: string;
  sort_order?: 'ASC' | 'DESC';
}

export interface IBaseEntity {
  id: TId;
  created_by: IUser;
  created_at: string;
  updated_by: IUser;
  updated_at: string;
  is_active: boolean;
}

export interface IMetaResponse {
  total: number;
  page: number;
  limit: number;
  skip: number;
}

export interface IBaseResponse<D = any> {
  success: boolean;
  statusCode: number;
  message: string;
  meta: IMetaResponse;
  data: D;
}

export interface IBaseServices<Entity = any, FilterOptions = any, CreatePayload = any, UpdatePayload = CreatePayload> {
  END_POINT: string;
  findById(id: TId): Promise<IBaseResponse<Entity>>;
  find(options: FilterOptions): Promise<IBaseResponse<Entity[]>>;
  create(payload: CreatePayload): Promise<IBaseResponse<Entity>>;
  update(payload: { id: TId; data: Partial<UpdatePayload> }): Promise<IBaseResponse<Entity>>;
  delete(id: TId): Promise<IBaseResponse<Entity>>;
}

export interface IBasePageProps {
  settingsIdentity: ISettingsIdentity;
  pages?: IPage[];
}
