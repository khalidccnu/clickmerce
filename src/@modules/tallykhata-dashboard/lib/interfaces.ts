import { IBaseFilter, IBaseResponse, TId } from '@base/interfaces';

export interface ITallykhataDashboardStatisticsFilter extends IBaseFilter {
  user_id?: TId;
}

export interface ITallykhataDashboardStatistics {
  total_transactions: number;
  credit_transactions: number;
  debit_transactions: number;
  total_credit_amount: number;
  total_debit_amount: number;
  net_balance: number;
}

export interface ITallykhataDashboardStatisticsResponse extends IBaseResponse {
  data: ITallykhataDashboardStatistics;
}

export interface ITallykhataDashboardAnalysis {
  month: string;
  transactions: number;
  credit_amount: number;
  debit_amount: number;
}

export interface ITallykhataDashboardAnalysesResponse extends IBaseResponse {
  data: ITallykhataDashboardAnalysis[];
}
