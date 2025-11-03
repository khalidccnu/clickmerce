import { PartialType } from '@lib/utils/yup';
import * as yup from 'yup';
import { settingsTaxTypes, settingsVatTypes } from './enums';

export const settingsIdentityCreateSchema = yup.object({
  name: yup.string().min(3).required(),
  initial_name: yup.string().min(3).required(),
  icon_url: yup.string().url().optional().nullable(),
  logo_url: yup.string().url().optional().nullable(),
  social_image_url: yup.string().url().optional().nullable(),
  phone_code: yup.string().min(2).required(),
  currency: yup.string().min(2).required(),
  description: yup.string().max(200).optional().nullable(),
});

export const settingsS3CreateSchema = yup.object({
  access_key_id: yup.string().min(5).required().nullable(),
  secret_access_key: yup.string().min(5).required().nullable(),
  endpoint: yup.string().url().required().nullable(),
  r2_worker_endpoint: yup.string().url().optional().nullable(),
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

export const settingsCreateSchema = yup.object({
  identity: settingsIdentityCreateSchema.required(),
  s3: settingsS3CreateSchema.required(),
  tax: settingsTaxCreateSchema.required(),
  vat: settingsVatCreateSchema.required(),
  is_active: yup.string().optional(),
});

export const settingsUpdateSchema = PartialType(settingsCreateSchema, true);

export type TSettingsCreateDto = yup.InferType<typeof settingsCreateSchema>;
export type TSettingsUpdateDto = yup.InferType<typeof settingsUpdateSchema>;
