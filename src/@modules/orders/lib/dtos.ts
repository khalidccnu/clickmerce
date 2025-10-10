import { baseFilterSchema } from '@base/dtos';
import { PartialType, PickType } from '@lib/utils/yup';
import { productDiscountTypes } from '@modules/products/lib/enums';
import * as yup from 'yup';

export const orderCreateSchema = yup.object({
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
  redeem_amount: yup.number().min(0).required(),
  pay_amount: yup.number().min(0).required(),
  payment_method_id: yup.string().uuid().required(),
  delivery_zone_id: yup.string().uuid().required(),
  customer_id: yup.string().uuid().required(),
  coupon_id: yup.string().uuid().required().nullable(),
  is_round_off: yup.boolean().required(),
  is_draft: yup.boolean().optional(),
});

export const orderUpdateSchema = PartialType(PickType(orderCreateSchema, ['pay_amount']), true);

export const orderReturnSchema = yup.object({
  products: yup
    .array()
    .of(
      yup.object({
        id: yup.string().uuid().required(),
        variations: yup
          .array()
          .of(
            yup.object({
              id: yup.string().uuid().required(),
              return_quantity: yup.number().min(1).required(),
            }),
          )
          .required(),
      }),
    )
    .required(),
  redeem_amount: yup.number().min(0).required(),
});

export const orderFilterSchema = yup
  .object({
    payment_status: yup.string().optional(),
    status: yup.string().optional(),
    customer_id: yup.string().uuid().optional(),
    payment_method_id: yup.string().uuid().optional(),
    delivery_zone_id: yup.string().uuid().optional(),
  })
  .concat(baseFilterSchema);

export type TOrderCreateDto = yup.InferType<typeof orderCreateSchema>;
export type TOrderUpdateDto = yup.InferType<typeof orderUpdateSchema>;
export type TOrderReturnDto = yup.InferType<typeof orderReturnSchema>;
export type TOrderFilterDto = yup.InferType<typeof orderFilterSchema>;
