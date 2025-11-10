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

export enum ENUM_SETTINGS_EMAIL_PROVIDER_TYPES {
  GMAIL = 'GMAIL',
  AWS_SES = 'AWS_SES',
  SENDGRID = 'SENDGRID',
  MAILGUN = 'MAILGUN',
  SMTP = 'SMTP',
  CUSTOM = 'CUSTOM',
}

export type TSettingsEmailProviderType = `${ENUM_SETTINGS_EMAIL_PROVIDER_TYPES}`;
export const settingsEmailProviderTypes: TSettingsEmailProviderType[] = Object.values(
  ENUM_SETTINGS_EMAIL_PROVIDER_TYPES,
);

export enum ENUM_SETTINGS_SMS_PROVIDER_TYPES {
  TWILIO = 'TWILIO',
  AWS_SNS = 'AWS_SNS',
  VONAGE = 'VONAGE',
  ALPHA_SMS = 'ALPHA_SMS',
  CUSTOM = 'CUSTOM',
}

export type TSettingsSmsProviderType = `${ENUM_SETTINGS_SMS_PROVIDER_TYPES}`;
export const settingsSmsProviderTypes: TSettingsSmsProviderType[] = Object.values(ENUM_SETTINGS_SMS_PROVIDER_TYPES);
