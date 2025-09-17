import { IBaseFilter } from '@base/interfaces';

export interface ISupabaseFilterCondition {
  ilike?: string;
  like?: string;
  eq?: string | number | boolean;
  neq?: string | number | boolean;
  in?: (string | number | boolean)[];
  notin?: (string | number | boolean)[];
  gte?: string | number;
  lte?: string | number;
  gt?: string | number;
  lt?: string | number;
}

export interface ISupabaseNestedFilter {
  [key: string]: ISupabaseFilterCondition | ISupabaseNestedFilter | string | number | boolean;
}

export interface ISupabaseFilter extends IBaseFilter {
  textFilters?:
    | { [field: string]: ISupabaseFilterCondition }
    | { [tableName: string]: { [fieldName: string]: ISupabaseFilterCondition } };
  numericFilters?:
    | { [field: string]: ISupabaseFilterCondition }
    | { [tableName: string]: { [fieldName: string]: ISupabaseFilterCondition } };
  dateFilters?:
    | { [field: string]: ISupabaseFilterCondition }
    | { [tableName: string]: { [fieldName: string]: ISupabaseFilterCondition } };
  customFilters?:
    | { [field: string]: string | number | boolean }
    | { [tableName: string]: { [fieldName: string]: string | number | boolean } };
}

export interface ISupabaseQueryOption {
  selection?: string;
  distinct?: boolean;
  head?: boolean;
  maybeSingle?: boolean;
}
