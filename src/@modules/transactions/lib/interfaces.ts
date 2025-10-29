import { IBaseEntity, IBaseFilter, IBaseResponse, TId } from '@base/interfaces';
import { IUser } from '@modules/users/lib/interfaces';
import { TTransactionType } from './enums';

export interface ITransactionsFilter extends IBaseFilter {
  type?: TTransactionType;
  user_id?: TId;
}

export interface ITransaction extends IBaseEntity {
  code: TId;
  type: TTransactionType;
  amount: number;
  note: string;
  user_id: TId;
  user: IUser;
  created_by_id: TId;
  created_by: IUser;
}

export interface ITransactionsResponse extends IBaseResponse {
  data: ITransaction[];
}

export interface ITransactionCreate {
  code: TId;
  type: TTransactionType;
  amount: number;
  note: string;
  user_id: TId;
  created_by_id: TId;
}
