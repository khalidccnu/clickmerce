import { IBaseFilter, IBaseResponse } from '@base/interfaces';

export interface IDashboardStatisticsFilter extends IBaseFilter {}

export interface IDashboardStatistics {
  pending_orders: number;
  shipped_orders: number;
  processing_orders: number;
  delivered_orders: number;
  cancelled_orders: number;
  total_sales_amount: number;
  total_due_amount: number;
  total_profit_amount: number;
}

export interface IDashboardStatisticsResponse extends IBaseResponse {
  data: IDashboardStatistics;
}

export interface IDashboardAnalysis {
  month: string;
  orders: number;
  sales_amount: number;
  profit_amount: number;
}

export interface IDashboardAnalysesResponse extends IBaseResponse {
  data: IDashboardAnalysis[];
}
