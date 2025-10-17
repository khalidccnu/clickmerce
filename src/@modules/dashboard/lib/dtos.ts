import { baseFilterSchema } from '@base/dtos';
import * as yup from 'yup';

export const dashboardStatisticsFilterSchema = baseFilterSchema;

export type TDashboardStatisticsFilterDto = yup.InferType<typeof dashboardStatisticsFilterSchema>;
