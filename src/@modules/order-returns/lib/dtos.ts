import { baseFilterSchema } from '@base/dtos';
import { productDiscountTypes } from '@modules/products/lib/enums';
import * as yup from 'yup';

export const orderReturnCreateSchema = yup.object({
  code: yup.string().required(),
  products: yup
    .array()
    .of(
      yup.object({
        id: yup.string().uuid().required(),
        variation_id: yup.string().uuid().required(),
        selected_quantity: yup.number().min(1).required(),
        discount: yup.object({
          type: yup.string().oneOf(productDiscountTypes).required(),
          amount: yup.number().min(0).required(),
        }),
      }),
    )
    .required(),
  order_id: yup.string().uuid().required(),
});

export const orderReturnFilterSchema = yup
  .object({
    customer_id: yup.string().uuid().optional(),
  })
  .concat(baseFilterSchema);

export type TOrderReturnCreateDto = yup.InferType<typeof orderReturnCreateSchema>;
export type TOrderReturnFilterDto = yup.InferType<typeof orderReturnFilterSchema>;
