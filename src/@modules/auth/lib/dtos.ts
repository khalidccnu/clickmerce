import { PartialType, PickType } from '@lib/utils/yup';
import { userCreateSchema } from '@modules/users/lib/dtos';
import * as yup from 'yup';

export const loginSchema = yup.object({
  phone: yup
    .string()
    .matches(/^\+\d+$/, ({ path }) => `${path} must start with + followed by numbers`)
    .required(),
  password: yup.string().min(8).max(20).required(),
});

export type TLoginDto = yup.InferType<typeof loginSchema>;

export const registerSchema = PickType(userCreateSchema, ['name', 'phone', 'email', 'password']);

export type TRegisterDto = yup.InferType<typeof registerSchema>;

export const passwordResetSchema = yup.object({
  phone: yup
    .string()
    .matches(/^\+\d+$/, ({ path }) => `${path} must start with + followed by numbers`)
    .required(),
  hash: yup.string().required(),
  otp: yup.number().min(6).required(),
  new_password: yup.string().min(8).max(20).required(),
});

export type TPasswordResetDto = yup.InferType<typeof passwordResetSchema>;

export const changePasswordSchema = yup.object({
  current_password: yup.string().min(8).max(20).required(),
  new_password: yup.string().min(8).max(20).required(),
});

export type TChangePasswordDto = yup.InferType<typeof changePasswordSchema>;

export const profileVerifySchema = yup.object({
  phone: yup
    .string()
    .matches(/^\+\d+$/, ({ path }) => `${path} must start with + followed by numbers`)
    .required(),
  hash: yup.string().required(),
  otp: yup.number().min(6).required(),
});

export type TProfileVerifyDto = yup.InferType<typeof profileVerifySchema>;

export const profileUpdateSchema = PartialType(
  PickType(userCreateSchema, ['name', 'email', 'birthday', 'blood_group']),
  true,
);

export type TProfileUpdateDto = yup.InferType<typeof profileUpdateSchema>;
