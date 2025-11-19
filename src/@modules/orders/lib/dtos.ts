import { baseFilterSchema } from '@base/dtos';
import { PartialType, PickType } from '@lib/utils/yup';
import { productDiscountTypes } from '@modules/products/lib/enums';
import * as yup from 'yup';
import { orderStatusTypes } from './enums';

export const orderQuickCreateSchema = yup.object({
  name: yup.string().min(3).required(),
  phone: yup
    .string()
    .matches(/^\+\d+$/, ({ path }) => `${path} must start with + followed by numbers`)
    .required(),
  email: yup.string().email().optional().nullable(),
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
  delivery_zone_id: yup.string().uuid().required(),
  payment_method_id: yup.string().uuid().required(),
  coupon: yup.string().required().nullable(),
});

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
  status: yup.string().oneOf(orderStatusTypes).optional(),
  is_round_off: yup.boolean().required(),
  is_draft: yup.boolean().optional(),
});

export const orderUpdateSchema = PartialType(PickType(orderCreateSchema, ['pay_amount', 'status']), true);

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

export type TOrderQuickCreateDto = yup.InferType<typeof orderQuickCreateSchema>;
export type TOrderCreateDto = yup.InferType<typeof orderCreateSchema>;
export type TOrderUpdateDto = yup.InferType<typeof orderUpdateSchema>;
export type TOrderReturnDto = yup.InferType<typeof orderReturnSchema>;
export type TOrderFilterDto = yup.InferType<typeof orderFilterSchema>;
