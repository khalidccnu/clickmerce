export enum ENUM_SETTINGS_S3_PROVIDER_TYPES {
  AWS_S3 = 'AWS_S3',
  DIGITALOCEAN = 'DIGITALOCEAN',
  CLOUDFLARE_R2 = 'CLOUDFLARE_R2',
  SUPABASE_STORAGE = 'SUPABASE_STORAGE',
  MINIO = 'MINIO',
  BACKBLAZE = 'BACKBLAZE',
  CUSTOM = 'CUSTOM',
}

export type TSettingsS3ProviderType = `${ENUM_SETTINGS_S3_PROVIDER_TYPES}`;
export const settingsS3ProviderTypes: TSettingsS3ProviderType[] = Object.values(ENUM_SETTINGS_S3_PROVIDER_TYPES);

export enum ENUM_SETTINGS_VAT_TYPES {
  PERCENTAGE = 'PERCENTAGE',
}

export type TSettingsVatType = `${ENUM_SETTINGS_VAT_TYPES}`;
export const settingsVatTypes: TSettingsVatType[] = Object.values(ENUM_SETTINGS_VAT_TYPES);

export enum ENUM_SETTINGS_TAX_TYPES {
  FIXED = 'FIXED',
  PERCENTAGE = 'PERCENTAGE',
}

export type TSettingsTaxType = `${ENUM_SETTINGS_TAX_TYPES}`;
export const settingsTaxTypes: TSettingsTaxType[] = Object.values(ENUM_SETTINGS_TAX_TYPES);
