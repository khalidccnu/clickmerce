import { IBaseEntity, IBaseResponse } from '@base/interfaces';
import { TSettingsS3ProviderType, TSettingsTaxType, TSettingsVatType } from './enums';

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

export interface ISettings extends IBaseEntity {
  identity: ISettingsIdentity;
  s3: ISettingsS3;
  vat: ISettingsVat;
  tax: ISettingsTax;
  is_s3_configured: boolean;
}

export interface ISettingsResponse extends IBaseResponse {
  data: ISettings;
}

export interface ISettingsCreate {
  identity: Partial<ISettingsIdentity>;
  s3: Partial<ISettingsS3>;
  vat: Partial<ISettingsVat>;
  tax: Partial<ISettingsTax>;
}
