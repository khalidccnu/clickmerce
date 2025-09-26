import { PartialType } from '@lib/utils/yup';
import * as yup from 'yup';

export const settingsIdentityCreateSchema = yup.object({
  name: yup.string().min(3).required(),
  initial_name: yup.string().min(3).required(),
  logo_url: yup.string().url().optional().nullable(),
  phone_code: yup.string().min(2).required(),
  currency: yup.string().min(2).required(),
});

export const settingsS3CreateSchema = yup.object({
  access_key_id: yup.string().min(5).required(),
  secret_access_key: yup.string().min(5).required(),
  endpoint: yup.string().url().required(),
  r2_worker_endpoint: yup.string().url().optional().nullable(),
  region: yup.string().min(3).required(),
  bucket: yup.string().min(3).required(),
});

export const settingsCreateSchema = yup.object({
  identity: settingsIdentityCreateSchema.required(),
  s3: settingsS3CreateSchema.required(),
  is_active: yup.string().optional(),
});

export const settingsUpdateSchema = PartialType(settingsCreateSchema, true);

export type TSettingsCreateDto = yup.InferType<typeof settingsCreateSchema>;
export type TSettingsUpdateDto = yup.InferType<typeof settingsUpdateSchema>;
