import { IBaseFilter } from '@base/interfaces';

export interface ISupabaseFilter extends IBaseFilter {
  textFilters?: {
    [field: string]: {
      ilike?: string;
      like?: string;
      eq?: string;
      neq?: string;
      in?: string[];
      notin?: string[];
    };
  };
  numericFilters?: {
    [field: string]: {
      gte?: number;
      lte?: number;
      gt?: number;
      lt?: number;
      eq?: number;
    };
  };
  dateFilters?: {
    [field: string]: {
      gte?: string;
      lte?: string;
      gt?: string;
      lt?: string;
    };
  };
  customFilters?: {
    [field: string]: any;
  };
}

export interface ISupabaseQueryOption {
  selection?: string;
  distinct?: boolean;
  head?: boolean;
  maybeSingle?: boolean;
}
