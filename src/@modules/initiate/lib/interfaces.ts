import { IUserCreate } from '@modules/users/lib/interfaces';
import { TInitiateType } from './enums';

export interface IInitiate {
  type: TInitiateType;
  user: IUserCreate;
}
