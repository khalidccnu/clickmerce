import * as yup from 'yup';

export const loginSchema = yup.object({
  phone: yup
    .string()
    .matches(/^\d+$/, ({ path }) => `${path} must contain only numbers`)
    .required(),
  password: yup.string().min(8).max(20).required(),
});

export type TLoginDto = yup.InferType<typeof loginSchema>;

export const changePasswordSchema = yup.object({
  current_password: yup.string().min(8).max(20).required(),
  new_password: yup.string().min(8).max(20).required(),
});

export type TChangePasswordDto = yup.InferType<typeof changePasswordSchema>;
