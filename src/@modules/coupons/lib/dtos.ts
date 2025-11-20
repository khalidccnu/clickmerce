import * as yup from 'yup';

export const couponValidateSchema = yup.object({
  code: yup.string().required(),
  products: yup
    .array()
    .of(
      yup.object({
        id: yup.string().uuid().required(),
        variation_id: yup.string().uuid().required(),
        selected_quantity: yup.number().min(1).required(),
      }),
    )
    .required(),
});

export type TCouponValidateDto = yup.InferType<typeof couponValidateSchema>;
