import { ISettingsCreate } from '@modules/settings/lib/interfaces';
import { IUserCreate } from '@modules/users/lib/interfaces';
import { TInitiateType } from './enums';

export interface IInitiate {
  user: IUserCreate;
  identity: ISettingsCreate['identity'];
  s3: ISettingsCreate['s3'];
  vat: ISettingsCreate['vat'];
  tax: ISettingsCreate['tax'];
  email: ISettingsCreate['email'];
  sms: ISettingsCreate['sms'];
  tracking_codes: ISettingsCreate['tracking_codes'];
}

export interface IInitiateCreate {
  type: TInitiateType;
  user: IUserCreate;
  settings: ISettingsCreate;
}
