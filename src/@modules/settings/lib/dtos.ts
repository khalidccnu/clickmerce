import { PartialType } from '@lib/utils/yup';
import * as yup from 'yup';
import {
  settingsEmailProviderTypes,
  settingsS3ProviderTypes,
  settingsSmsProviderTypes,
  settingsTaxTypes,
  settingsVatTypes,
} from './enums';

export const settingsIdentityCreateSchema = yup.object({
  name: yup.string().min(3).required(),
  initial_name: yup.string().min(3).required(),
  icon_url: yup.string().url().optional().nullable(),
  logo_url: yup.string().url().optional().nullable(),
  social_image_url: yup.string().url().optional().nullable(),
  phone_code: yup.string().min(2).required(),
  currency: yup.string().min(2).required(),
  description: yup.string().max(200).optional().nullable(),
  phone: yup.string().optional().nullable(),
  email: yup.string().email().optional().nullable(),
  address: yup.string().optional().nullable(),
  fb_url: yup.string().url().optional().nullable(),
  ig_url: yup.string().url().optional().nullable(),
  yt_url: yup.string().url().optional().nullable(),
});

export const settingsS3CreateSchema = yup.object({
  provider: yup.string().oneOf(settingsS3ProviderTypes).required().nullable(),
  access_key_id: yup.string().min(5).required().nullable(),
  secret_access_key: yup.string().min(5).required().nullable(),
  endpoint: yup.string().url().required().nullable(),
  custom_url: yup.string().url().optional().nullable(),
  region: yup.string().min(3).required().nullable(),
  bucket: yup.string().min(3).required().nullable(),
});

export const settingsVatCreateSchema = yup.object({
  type: yup.string().oneOf(settingsVatTypes).required(),
  amount: yup.number().min(0).required(),
});

export const settingsTaxCreateSchema = yup.object({
  type: yup.string().oneOf(settingsTaxTypes).required(),
  amount: yup.number().min(0).required(),
});

export const settingsEmailCreateSchema = yup.object({
  provider: yup.string().oneOf(settingsEmailProviderTypes).required(),
  from_name: yup.string().min(3).required(),
  from_email: yup.string().email().required(),
  host: yup.string().min(3).optional().nullable(),
  port: yup.number().min(1).optional().nullable(),
  username: yup.string().min(3).optional().nullable(),
  password: yup.string().min(3).optional().nullable(),
  is_secure: yup.boolean().optional().nullable(),
  api_key: yup.string().min(3).optional().nullable(),
  region: yup.string().min(3).optional().nullable(),
});

export const settingsSmsCreateSchema = yup.object({
  provider: yup.string().oneOf(settingsSmsProviderTypes).required(),
  account_sid: yup.string().min(3).optional().nullable(),
  auth_token: yup.string().min(3).optional().nullable(),
  api_key: yup.string().min(3).optional().nullable(),
  api_secret: yup.string().min(3).optional().nullable(),
  region: yup.string().min(3).optional().nullable(),
});

export const settingsCreateSchema = yup.object({
  identity: settingsIdentityCreateSchema.required(),
  s3: settingsS3CreateSchema.required(),
  tax: settingsTaxCreateSchema.required(),
  vat: settingsVatCreateSchema.required(),
  email: settingsEmailCreateSchema.required(),
  sms: settingsSmsCreateSchema.required(),
  is_active: yup.string().optional(),
});

export const settingsUpdateSchema = PartialType(settingsCreateSchema, true);

export type TSettingsCreateDto = yup.InferType<typeof settingsCreateSchema>;
export type TSettingsUpdateDto = yup.InferType<typeof settingsUpdateSchema>;
