import { OmitType } from '@lib/utils/yup';
import { userCreateSchema } from '@modules/users/lib/dtos';
import * as yup from 'yup';
import { ENUM_INITIATE_TYPE, TInitiateType } from './enums';

export const initiateSchema = yup.object({
  type: yup.mixed<TInitiateType>().oneOf(Object.values(ENUM_INITIATE_TYPE)).required(),
  user: OmitType(userCreateSchema, ['roles', 'is_admin', 'is_active']),
});

export type TInitiateDto = yup.InferType<typeof initiateSchema>;
