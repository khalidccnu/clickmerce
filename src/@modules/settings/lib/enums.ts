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
