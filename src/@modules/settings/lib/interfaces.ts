import { IBaseEntity, IBaseResponse } from '@base/interfaces';
import {
  TSettingsEmailProviderType,
  TSettingsS3ProviderType,
  TSettingsSmsProviderType,
  TSettingsTaxType,
  TSettingsVatType,
} from './enums';

export interface ISettingsIdentity {
  name: string;
  initial_name: string;
  icon_url: string;
  logo_url: string;
  social_image_url: string;
  phone_code: string;
  currency: string;
  description: string;
  phone: string;
  email: string;
  address: string;
  fb_url: string;
  ig_url: string;
  yt_url: string;
}

export interface ISettingsS3 {
  provider: TSettingsS3ProviderType;
  access_key_id: string;
  secret_access_key: string;
  endpoint: string;
  region: string;
  bucket: string;
  custom_url: string;
}

export interface ISettingsVat {
  type: TSettingsVatType;
  amount: number;
}

export interface ISettingsTax {
  type: TSettingsTaxType;
  amount: number;
}

export interface ISettingsEmail {
  provider: TSettingsEmailProviderType;
  from_name: string;
  from_email: string;
  host: string;
  port: number;
  username: string;
  password: string;
  is_secure: boolean;
  api_key: string;
  region: string;
}

export interface ISettingsSms {
  provider: TSettingsSmsProviderType;
  account_sid: string;
  auth_token: string;
  api_key: string;
  api_secret: string;
  region: string;
}

export interface ISettings extends IBaseEntity {
  identity: ISettingsIdentity & {
    is_user_registration_acceptance: boolean;
    need_user_registration_verification: boolean;
  };
  s3: ISettingsS3;
  vat: ISettingsVat;
  tax: ISettingsTax;
  email: ISettingsEmail;
  sms: ISettingsSms;
  is_s3_configured: boolean;
}

export interface ISettingsResponse extends IBaseResponse {
  data: ISettings;
}

export interface ISettingsCreate {
  identity: Partial<
    ISettingsIdentity & {
      is_user_registration_acceptance: string;
      need_user_registration_verification: string;
    }
  >;
  s3: Partial<ISettingsS3>;
  vat: Partial<ISettingsVat>;
  tax: Partial<ISettingsTax>;
  email: Partial<ISettingsEmail>;
  sms: Partial<ISettingsSms>;
}
