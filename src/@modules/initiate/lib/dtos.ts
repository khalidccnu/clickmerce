import { OmitType, PartialType } from '@lib/utils/yup';
import { settingsIdentityCreateSchema, settingsS3CreateSchema } from '@modules/settings/lib/dtos';
import { userCreateSchema } from '@modules/users/lib/dtos';
import * as yup from 'yup';
import { ENUM_INITIATE_TYPE, TInitiateType } from './enums';

export const initiateCreateSchema = yup.object({
  type: yup.mixed<TInitiateType>().oneOf(Object.values(ENUM_INITIATE_TYPE)).required(),
  user: OmitType(userCreateSchema, ['roles', 'is_admin', 'is_active']),
  settings: yup
    .object({
      identity: settingsIdentityCreateSchema.required(),
      s3: PartialType(settingsS3CreateSchema, true).optional(),
    })
    .required(),
});

export type TInitiateCreateDto = yup.InferType<typeof initiateCreateSchema>;
