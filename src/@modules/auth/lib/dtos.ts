import * as yup from 'yup';

export const loginSchema = yup.object({
  // phone_code: yup.string().min(2).required(),
  phone: yup
    .string()
    .matches(/^\d+$/, ({ path }) => `${path} must contain only numbers`)
    .matches(/^(13|14|15|16|17|18|19)/, ({ path }) => `${path} must be a valid`)
    .length(10)
    .required(),
  password: yup.string().min(8).max(20).required(),
});

export type TLoginDto = yup.InferType<typeof loginSchema>;

export const changePasswordSchema = yup.object({
  current_password: yup.string().min(8).max(20).required(),
  new_password: yup.string().min(8).max(20).required(),
});

export type TChangePasswordDto = yup.InferType<typeof changePasswordSchema>;
