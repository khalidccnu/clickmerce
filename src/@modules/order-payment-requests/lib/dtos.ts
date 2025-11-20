import * as yup from 'yup';

export const orderPaymentRequestQuickCreateSchema = yup.object({
  payment_reference: yup.string().required(),
  order_id: yup.string().uuid().required(),
});

export type TOrderPaymentRequestQuickCreateDto = yup.InferType<typeof orderPaymentRequestQuickCreateSchema>;
