import { baseFilterSchema } from '@base/dtos';
import { ENUM_BLOOD_GROUP_TYPE, TBloodGroupType } from '@base/enums';
import { OmitType, PartialType, PickType } from '@lib/utils/yup';
import * as yup from 'yup';

export const userRoleCreateSchema = yup.object({
  id: yup.string().uuid().required(),
});

export const userRoleUpdateSchema = yup.object({
  id: yup.string().uuid().required(),
  is_deleted: yup.boolean().optional(),
});

export const userCreateSchema = yup.object({
  name: yup.string().min(3).required(),
  phone: yup
    .string()
    .matches(/^\+\d+$/, ({ path }) => `${path} must start with + followed by numbers`)
    .required(),
  email: yup.string().email().optional().nullable(),
  password: yup.string().min(8).max(20).optional().nullable(),
  birthday: yup.string().optional().nullable(),
  blood_group: yup.mixed<TBloodGroupType>().oneOf(Object.values(ENUM_BLOOD_GROUP_TYPE)).optional().nullable(),
  roles: yup.array().of(userRoleCreateSchema).optional().nullable(),
  is_admin: yup.string().optional(),
  is_active: yup.string().optional(),
});

export const userUpdateSchema = PartialType(OmitType(userCreateSchema, ['roles'])).concat(
  yup.object({
    roles: yup.array().of(userRoleUpdateSchema).optional().nullable(),
  }),
);

export const userFilterSchema = PickType(userCreateSchema, ['blood_group', 'is_admin', 'is_active']).concat(
  baseFilterSchema,
);

export type TUserCreateDto = yup.InferType<typeof userCreateSchema>;
export type TUserUpdateDto = yup.InferType<typeof userUpdateSchema>;
export type TUserFilterDto = yup.InferType<typeof userFilterSchema>;
