import { IBaseEntity, IBaseResponse } from '@base/interfaces';

export interface ISettingsIdentity {
  name: string;
  initial_name: string;
  logo_url?: string;
  phone_code: string;
  currency: string;
}

export interface ISettingsS3 {
  access_key_id: string;
  secret_access_key: string;
  endpoint: string;
  r2_worker_endpoint?: string;
  region: string;
  bucket: string;
}

export interface ISettings extends IBaseEntity {
  identity: ISettingsIdentity;
  s3: ISettingsS3;
  is_s3_configured: boolean;
}

export interface ISettingsResponse extends IBaseResponse {
  data: ISettings;
}

export interface ISettingsCreate {
  identity: ISettingsIdentity;
  s3: ISettingsS3;
}
