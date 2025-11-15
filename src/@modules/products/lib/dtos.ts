import { baseFilterSchema } from '@base/dtos';
import * as yup from 'yup';
import { productTypes } from './enums';

export const productFilterSchema = yup
  .object({
    type: yup.string().oneOf(productTypes).optional(),
    category_id: yup.string().uuid().optional(),
    dosage_form_id: yup.string().uuid().optional(),
    generic_id: yup.string().uuid().optional(),
    supplier_id: yup.string().uuid().optional(),
    is_expired: yup.boolean().optional(),
    is_low_stock: yup.boolean().optional(),
  })
  .concat(baseFilterSchema);

export type TProductFilterDto = yup.InferType<typeof productFilterSchema>;
