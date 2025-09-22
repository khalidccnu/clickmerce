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
  textFilters?:
    | {
        [field: string]: ISupabaseTextFilterCondition;
      }
    | {
        [tableName: string]: {
          [fieldName: string]: ISupabaseTextFilterCondition;
        };
      };
  numericFilters?:
    | {
        [field: string]: ISupabaseNumericFilterCondition;
      }
    | {
        [tableName: string]: {
          [fieldName: string]: ISupabaseNumericFilterCondition;
        };
      };
  dateFilters?:
    | {
        [field: string]: ISupabaseDateFilterCondition;
      }
    | {
        [tableName: string]: {
          [fieldName: string]: ISupabaseDateFilterCondition;
        };
      };
  booleanFilters?:
    | {
        [field: string]: ISupabaseBooleanFilterCondition;
      }
    | {
        [tableName: string]: {
          [fieldName: string]: ISupabaseBooleanFilterCondition;
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
