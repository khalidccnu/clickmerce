import { baseFilterSchema } from '@base/dtos';
import * as yup from 'yup';

export const reviewQuickFilterSchema = yup
  .object({
    product_id: yup.string().uuid().optional(),
  })
  .concat(baseFilterSchema);

export type TReviewQuickFilterDto = yup.InferType<typeof reviewQuickFilterSchema>;
