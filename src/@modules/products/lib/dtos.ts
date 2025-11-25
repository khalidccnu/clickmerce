import { baseFilterSchema } from '@base/dtos';
import * as yup from 'yup';
import { productTypes } from './enums';

export const productFilterSchema = yup
  .object({
    type: yup.string().oneOf(productTypes).optional(),
    category_ids: yup
      .mixed()
      .optional()
      .test('isArrayOfUuids', `category_ids must be an array of UUIDs`, (value) => {
        if (!value) return true;

        let arr: string[];

        if (typeof value === 'string') {
          try {
            const parsed = JSON.parse(value);
            if (!Array.isArray(parsed)) return false;
            arr = parsed;
          } catch {
            return false;
          }
        } else if (Array.isArray(value)) {
          arr = value;
        } else {
          return false;
        }

        return arr.every(
          (item) =>
            typeof item === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(item),
        );
      }),
    dosage_form_id: yup.string().uuid().optional(),
    generic_id: yup.string().uuid().optional(),
    supplier_id: yup.string().uuid().optional(),
    is_expired: yup.string().optional(),
    is_low_stock: yup.string().optional(),
    is_recommend: yup.string().optional(),
    is_special: yup.string().optional(),
    except_ids: yup
      .mixed()
      .optional()
      .test('isArrayOfUuids', `except_ids must be an array of UUIDs`, (value) => {
        if (!value) return true;

        let arr: string[];

        if (typeof value === 'string') {
          try {
            const parsed = JSON.parse(value);
            if (!Array.isArray(parsed)) return false;
            arr = parsed;
          } catch {
            return false;
          }
        } else if (Array.isArray(value)) {
          arr = value;
        } else {
          return false;
        }

        return arr.every(
          (item) =>
            typeof item === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(item),
        );
      }),
  })
  .concat(baseFilterSchema);

export type TProductFilterDto = yup.InferType<typeof productFilterSchema>;
