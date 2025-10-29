import { baseFilterSchema } from '@base/dtos';
import * as yup from 'yup';

export const tallykhataDashboardStatisticsFilterSchema = baseFilterSchema.concat(
  yup.object({
    user_id: yup.string().uuid().optional(),
  }),
);

export type TTallykhataDashboardStatisticsFilterDto = yup.InferType<typeof tallykhataDashboardStatisticsFilterSchema>;
