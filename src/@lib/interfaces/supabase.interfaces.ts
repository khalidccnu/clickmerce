import { IBaseFilter } from '@base/interfaces';

export interface ISupabaseTextFilterCondition {
  eq?: string;
  neq?: string;
  in?: string[];
  notin?: string[];
  like?: string;
  ilike?: string;
}

export interface ISupabaseNumericFilterCondition {
  eq?: number;
  neq?: number;
  in?: number[];
  notin?: number[];
  gt?: number;
  lt?: number;
  gte?: number;
  lte?: number;
}

export interface ISupabaseDateFilterCondition {
  eq?: string;
  neq?: string;
  in?: string[];
  notin?: string[];
  gt?: string;
  lt?: string;
  gte?: string;
  lte?: string;
}

export interface ISupabaseBooleanFilterCondition {
  eq?: boolean;
  neq?: boolean;
}

export interface ISupabaseFilter extends IBaseFilter {
  textFilters?: {
    type?: 'and' | 'or';
    conditions:
      | {
          [field: string]: ISupabaseTextFilterCondition;
        }
      | {
          [table: string]: {
            [field: string]: ISupabaseTextFilterCondition;
          };
        };
  };
  numericFilters?: {
    type?: 'and' | 'or';
    conditions:
      | {
          [field: string]: ISupabaseNumericFilterCondition;
        }
      | {
          [table: string]: {
            [field: string]: ISupabaseNumericFilterCondition;
          };
        };
  };
  dateFilters?: {
    type?: 'and' | 'or';
    conditions:
      | {
          [field: string]: ISupabaseDateFilterCondition;
        }
      | {
          [table: string]: {
            [field: string]: ISupabaseDateFilterCondition;
          };
        };
  };
  booleanFilters?: {
    type?: 'and' | 'or';
    conditions:
      | {
          [field: string]: ISupabaseBooleanFilterCondition;
        }
      | {
          [table: string]: {
            [field: string]: ISupabaseBooleanFilterCondition;
          };
        };
  };
}

export interface ISupabaseQueryOption {
  selection?: string;
  distinct?: boolean;
  head?: boolean;
  maybeSingle?: boolean;
}

export interface ISupabaseSelectionOption {
  table: string;
  columns?: string[];
  nested?: Record<string, ISupabaseSelectionOption>;
}
