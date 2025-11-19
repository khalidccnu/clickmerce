import * as yup from 'yup';

export const couponValidateSchema = yup.object({
  code: yup.string().required(),
  subtotal: yup.number().min(0).required(),
});

export type TCouponValidateDto = yup.InferType<typeof couponValidateSchema>;
