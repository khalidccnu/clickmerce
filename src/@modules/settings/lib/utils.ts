import {
  ENUM_SETTINGS_EMAIL_PROVIDER_TYPES,
  ENUM_SETTINGS_SMS_PROVIDER_TYPES,
  TSettingsEmailProviderType,
  TSettingsSmsProviderType,
} from './enums';

export const requiredSettingsEmailFieldsFn = (provider: TSettingsEmailProviderType): string[] => {
  switch (provider) {
    case ENUM_SETTINGS_EMAIL_PROVIDER_TYPES.GMAIL:
      return ['username', 'password'];
    case ENUM_SETTINGS_EMAIL_PROVIDER_TYPES.AWS_SES:
      return ['username', 'password', 'region'];
    case ENUM_SETTINGS_EMAIL_PROVIDER_TYPES.SENDGRID:
      return ['api_key'];
    case ENUM_SETTINGS_EMAIL_PROVIDER_TYPES.MAILGUN:
      return ['host', 'port', 'username', 'password'];
    case ENUM_SETTINGS_EMAIL_PROVIDER_TYPES.SMTP:
      return ['host', 'port', 'username', 'password', 'is_secure'];
    case ENUM_SETTINGS_EMAIL_PROVIDER_TYPES.CUSTOM:
    default:
      return [];
  }
};

export const requiredSettingsSmsFieldsFn = (provider: TSettingsSmsProviderType): string[] => {
  switch (provider) {
    case ENUM_SETTINGS_SMS_PROVIDER_TYPES.TWILIO:
      return ['account_sid', 'auth_token'];
    case ENUM_SETTINGS_SMS_PROVIDER_TYPES.AWS_SNS:
      return ['api_key', 'api_secret', 'region'];
    case ENUM_SETTINGS_SMS_PROVIDER_TYPES.VONAGE:
      return ['api_key', 'api_secret'];
    case ENUM_SETTINGS_SMS_PROVIDER_TYPES.ALPHA_SMS:
      return ['endpoint', 'api_key'];
    case ENUM_SETTINGS_SMS_PROVIDER_TYPES.CUSTOM:
    default:
      return [];
  }
};
