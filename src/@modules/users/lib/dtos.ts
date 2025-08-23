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
  phone_code: yup.string().min(2).required(),
  phone: yup
    .string()
    .matches(/^\d+$/, ({ path }) => `${path} must contain only numbers`)
    .matches(/^(13|14|15|16|17|18|19)/, ({ path }) => `${path} must be a valid`)
    .length(10)
    .required(),
  email: yup.string().email().optional(),
  password: yup.string().min(8).max(20).optional(),
  birthday: yup.string().required(),
  blood_group: yup.mixed<TBloodGroupType>().oneOf(Object.values(ENUM_BLOOD_GROUP_TYPE)).required(),
  roles: yup.array().of(userRoleCreateSchema).optional(),
  is_admin: yup.string().optional(),
  is_active: yup.string().optional(),
});

export const userUpdateSchema = PartialType(OmitType(userCreateSchema, ['roles'])).concat(
  yup.object({
    roles: yup.array().of(userRoleUpdateSchema).optional(),
  }),
);

export const userFilterSchema = PickType(userCreateSchema, ['is_admin', 'is_active']).concat(baseFilterSchema);

export type TUserCreateDto = yup.InferType<typeof userCreateSchema>;
export type TUserUpdateDto = yup.InferType<typeof userUpdateSchema>;
export type TUserFilterDto = yup.InferType<typeof userFilterSchema>;
