import * as yup from 'yup';
import { ENUM_SORT_ORDER_TYPE, TSortOrderType } from './enums';

export const baseFilterSchema = yup.object({
  page: yup.string().matches(/^\d+$/, 'Must be a numeric string').optional().default('1'),
  limit: yup.string().matches(/^\d+$/, 'Must be a numeric string').optional().default('10'),
  search_term: yup.string().optional(),
  search_field: yup.string().optional(),
  search_fields: yup.array().of(yup.string()).optional(),
  start_date: yup.string().optional(),
  end_date: yup.string().optional(),
  sort_by: yup.string().optional(),
  sort_order: yup.mixed<TSortOrderType>().oneOf(Object.values(ENUM_SORT_ORDER_TYPE)).optional(),
  is_active: yup.string().oneOf(['true', 'false']).optional(),
});

export type TBaseFilterDto = yup.InferType<typeof baseFilterSchema>;
