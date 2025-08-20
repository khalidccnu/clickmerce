import { IBaseResponse, TId } from '@base/interfaces';
import { ISupabaseFilter, ISupabaseQueryOption } from '@lib/interfaces/supabase.interfaces';
import { SupabaseClient } from '@supabase/supabase-js';

export const SupabaseAdapter = {
  async findById<T = any>(
    supabase: SupabaseClient,
    table: string,
    id: TId,
    options: { selection?: string } = {},
  ): Promise<IBaseResponse<T>> {
    try {
      const { selection = '*' } = options;

      const result = await supabase.from(table).select(selection).eq('id', id).maybeSingle();

      if (result?.error) {
        throw new Error(`Find by ID failed: ${result.error.message}`);
      }

      if (!result.data) {
        return {
          success: false,
          statusCode: 404,
          message: `Record with ID ${id} not found`,
          data: null,
          meta: null,
        };
      }

      return {
        success: true,
        statusCode: 200,
        message: 'Record found successfully',
        data: result.data as T,
        meta: null,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

      return {
        success: false,
        statusCode: 500,
        message: `Find by ID operation failed: ${errorMessage}`,
        data: null,
        meta: null,
      };
    }
  },

  async findByIds<T = any>(
    supabase: SupabaseClient,
    table: string,
    ids: TId[],
    options: { selection?: string } = {},
  ): Promise<IBaseResponse<T[]>> {
    try {
      const { selection = '*' } = options;

      if (!Array.isArray(ids) || !ids.length) {
        return {
          success: false,
          statusCode: 400,
          message: 'IDs must be a non-empty array',
          data: [],
          meta: null,
        };
      }

      const result = await supabase.from(table).select(selection).in('id', ids);

      if (result?.error) {
        throw new Error(`Find by IDs failed: ${result.error.message}`);
      }

      const data = Array.isArray(result.data) ? (result.data as T[]) : [];

      return {
        success: true,
        statusCode: 200,
        message: 'Records found successfully',
        data,
        meta: null,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

      return {
        success: false,
        statusCode: 500,
        message: `Find by IDs operation failed: ${errorMessage}`,
        data: [],
        meta: null,
      };
    }
  },

  async findOne<T = any>(
    supabase: SupabaseClient,
    table: string,
    filters: ISupabaseFilter = {},
    options: { selection?: string } = {},
  ): Promise<IBaseResponse<T>> {
    try {
      const { selection = '*' } = options;

      const result = await this.find(supabase, table, filters, {
        ...options,
        selection,
        maybeSingle: true,
      });

      if (!result.success) {
        return {
          success: false,
          statusCode: result.statusCode,
          message: result.message,
          data: null,
          meta: null,
        };
      }

      const data = Array.isArray(result.data) && result.data.length ? (result.data[0] as T) : null;

      if (!data) {
        return {
          success: false,
          statusCode: 404,
          message: 'No record found matching the criteria',
          data: null,
          meta: null,
        };
      }

      return {
        success: true,
        statusCode: 200,
        message: 'Record found successfully',
        data,
        meta: null,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

      return {
        success: false,
        statusCode: 500,
        message: `Find one operation failed: ${errorMessage}`,
        data: null,
        meta: null,
      };
    }
  },

  async find<T = any>(
    supabase: SupabaseClient,
    table: string,
    filters: ISupabaseFilter = {},
    options: ISupabaseQueryOption = {},
  ): Promise<IBaseResponse<T[]>> {
    try {
      const { selection = '*', distinct = false, head = false, maybeSingle = false } = options;

      let query = supabase.from(table).select(selection, {
        count: 'exact',
        head,
        ...(distinct && { distinct: true }),
      });

      if (filters.search_term) {
        if (filters.search_fields && Array.isArray(filters.search_fields)) {
          const searchConditions = filters.search_fields
            .map((field) => `${field}.ilike.%${filters.search_term}%`)
            .join(',');

          query = query.or(searchConditions);
        } else if (filters.search_field) {
          query = query.ilike(filters.search_field, `%${filters.search_term}%`);
        }
      }

      if (filters.start_date || filters.end_date) {
        const dateField = filters.sort_by || 'created_at';

        if (filters.start_date) {
          query = query.gte(dateField, filters.start_date);
        }

        if (filters.end_date) {
          query = query.lte(dateField, filters.end_date);
        }
      }

      if (filters.dateFilters) {
        Object.entries(filters.dateFilters).forEach(([field, conditions]) => {
          if (conditions && typeof conditions === 'object') {
            if ('gte' in conditions && conditions.gte) query = query.gte(field, conditions.gte);
            if ('lte' in conditions && conditions.lte) query = query.lte(field, conditions.lte);
            if ('gt' in conditions && conditions.gt) query = query.gt(field, conditions.gt);
            if ('lt' in conditions && conditions.lt) query = query.lt(field, conditions.lt);
          }
        });
      }

      if (filters.numericFilters) {
        Object.entries(filters.numericFilters).forEach(([field, conditions]) => {
          if (conditions && typeof conditions === 'object') {
            if ('gte' in conditions && conditions.gte !== undefined) query = query.gte(field, conditions.gte);
            if ('lte' in conditions && conditions.lte !== undefined) query = query.lte(field, conditions.lte);
            if ('gt' in conditions && conditions.gt !== undefined) query = query.gt(field, conditions.gt);
            if ('lt' in conditions && conditions.lt !== undefined) query = query.lt(field, conditions.lt);
            if ('eq' in conditions && conditions.eq !== undefined) query = query.eq(field, conditions.eq);
          }
        });
      }

      if (filters.textFilters) {
        Object.entries(filters.textFilters).forEach(([field, conditions]) => {
          if (conditions && typeof conditions === 'object') {
            if ('ilike' in conditions && conditions.ilike) query = query.ilike(field, conditions.ilike);
            if ('like' in conditions && conditions.like) query = query.like(field, conditions.like);
            if ('eq' in conditions && conditions.eq) query = query.eq(field, conditions.eq);
            if ('neq' in conditions && conditions.neq) query = query.neq(field, conditions.neq);
            if ('in' in conditions && conditions.in) query = query.in(field, conditions.in);
            if ('notin' in conditions && conditions.notin) {
              query = query.not(field, 'in', `(${conditions.notin.join(',')})`);
            }
          }
        });
      }

      if (filters.is_active !== undefined) {
        const isActive = typeof filters.is_active === 'string' ? filters.is_active === 'true' : filters.is_active;
        query = query.eq('is_active', isActive);
      }

      if (filters.customFilters) {
        Object.entries(filters.customFilters).forEach(([field, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            query = query.eq(field, value);
          }
        });
      }

      const excludedKeys = [
        'page',
        'limit',
        'search_term',
        'search_field',
        'search_fields',
        'is_active',
        'start_date',
        'end_date',
        'sort_by',
        'sort_order',
        'dateFilters',
        'numericFilters',
        'textFilters',
        'customFilters',
      ];

      Object.entries(filters).forEach(([key, value]) => {
        if (!excludedKeys.includes(key) && value !== undefined && value !== null && value !== '') {
          query = query.eq(key, value);
        }
      });

      const sortBy = filters.sort_by || 'created_at';
      const ascending = filters.sort_order ? filters.sort_order === 'ASC' : true;
      query = query.order(sortBy, { ascending });

      let offset = 0;

      if (filters.page && filters.limit) {
        offset = (filters.page - 1) * filters.limit;
        query = query.range(offset, offset + filters.limit - 1);
      }

      const result = maybeSingle ? await query.maybeSingle() : await query;

      if (result?.error) {
        throw new Error(`Query failed: ${result.error.message}`);
      }

      const total = result.count || 0;
      const page = filters.page || 1;
      const limit = filters.limit || total;
      const skip = filters.page && filters.limit ? (filters.page - 1) * filters.limit : 0;
      const data = Array.isArray(result.data)
        ? (result.data as T[])
        : result.data
          ? ([result.data] as T[])
          : ([] as T[]);

      return {
        success: true,
        statusCode: 200,
        message: 'Query executed successfully',
        data,
        meta: {
          total,
          page,
          limit,
          skip,
        },
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

      return {
        success: false,
        statusCode: 500,
        message: `Query execution failed: ${errorMessage}`,
        data: [],
        meta: null,
      };
    }
  },

  async create<T = any>(
    supabase: SupabaseClient,
    table: string,
    payload: Record<string, any>,
    options: { selection?: string; returning?: boolean } = {},
  ): Promise<IBaseResponse<T>> {
    try {
      const { selection = '*', returning = true } = options;

      const result = returning
        ? await supabase.from(table).insert(payload).select(selection).single()
        : await supabase.from(table).insert(payload);

      if (result?.error) {
        throw new Error(`Create failed: ${result.error.message}`);
      }

      return {
        success: true,
        statusCode: 201,
        message: 'Record created successfully',
        data: returning ? (result.data as T) : (payload as T),
        meta: null,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

      return {
        success: false,
        statusCode: 500,
        message: `Create operation failed: ${errorMessage}`,
        data: null,
        meta: null,
      };
    }
  },

  async batchCreate<T = any>(
    supabase: SupabaseClient,
    table: string,
    payload: Record<string, any>[],
    options: { selection?: string; returning?: boolean; chunkSize?: number } = {},
  ): Promise<IBaseResponse<T[]>> {
    try {
      const { selection = '*', returning = true, chunkSize = 100 } = options;

      if (!Array.isArray(payload) || !payload.length) {
        return {
          success: false,
          statusCode: 400,
          message: 'Payloads must be a non-empty array',
          data: [],
          meta: null,
        };
      }

      const chunks: Record<string, any>[][] = [];

      for (let i = 0; i < payload.length; i += chunkSize) {
        chunks.push(payload.slice(i, i + chunkSize));
      }

      const purifiedResult: T[] = [];

      for (const chunk of chunks) {
        const result = returning
          ? await supabase.from(table).insert(chunk).select(selection)
          : await supabase.from(table).insert(chunk);

        if (result?.error) {
          throw new Error(`Batch create failed: ${result.error.message}`);
        }

        if (returning && result.data) {
          purifiedResult.push(...(result.data as T[]));
        }
      }

      return {
        success: true,
        statusCode: 201,
        message: `${payload.length} records created successfully`,
        data: returning ? purifiedResult : (payload as T[]),
        meta: null,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

      return {
        success: false,
        statusCode: 500,
        message: `Batch create operation failed: ${errorMessage}`,
        data: [],
        meta: null,
      };
    }
  },

  async update<T = any>(
    supabase: SupabaseClient,
    table: string,
    id: TId,
    payload: Record<string, any>,
    options: { selection?: string; returning?: boolean } = {},
  ): Promise<IBaseResponse<T>> {
    try {
      const { selection = '*', returning = true } = options;

      const result = returning
        ? await supabase.from(table).update(payload).eq('id', id).select(selection).single()
        : await supabase.from(table).update(payload).eq('id', id);

      if (result?.error) {
        throw new Error(`Update failed: ${result.error.message}`);
      }

      if (returning && !result.data) {
        return {
          success: false,
          statusCode: 404,
          message: `Record with ID ${id} not found for update`,
          data: null,
          meta: null,
        };
      }

      return {
        success: true,
        statusCode: 200,
        message: 'Record updated successfully',
        data: returning ? (result.data as T) : ({ id, ...payload } as T),
        meta: null,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

      return {
        success: false,
        statusCode: 500,
        message: `Update operation failed: ${errorMessage}`,
        data: null,
        meta: null,
      };
    }
  },

  async upsert<T = any>(
    supabase: SupabaseClient,
    table: string,
    payload: Record<string, any>,
    options: {
      selection?: string;
      returning?: boolean;
      onConflict?: string;
      ignoreDuplicates?: boolean;
    } = {},
  ): Promise<IBaseResponse<T>> {
    try {
      const { selection = '*', returning = true, onConflict, ignoreDuplicates = false } = options;

      const result = returning
        ? await supabase
            .from(table)
            .upsert(payload, {
              ...(onConflict && { onConflict }),
              ignoreDuplicates,
            })
            .select(selection)
            .single()
        : await supabase.from(table).upsert(payload, {
            ...(onConflict && { onConflict }),
            ignoreDuplicates,
          });

      if (result?.error) {
        throw new Error(`Upsert failed: ${result.error.message}`);
      }

      return {
        success: true,
        statusCode: 200,
        message: 'Record upserted successfully',
        data: returning ? (result.data as T) : (payload as T),
        meta: null,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

      return {
        success: false,
        statusCode: 500,
        message: `Upsert operation failed: ${errorMessage}`,
        data: null,
        meta: null,
      };
    }
  },

  async delete<T = any>(
    supabase: SupabaseClient,
    table: string,
    id: TId,
    options: { selection?: string; returning?: boolean; softDelete?: boolean; softDeleteField?: string } = {},
  ): Promise<IBaseResponse<T>> {
    try {
      const { selection = '*', returning = true, softDelete = false, softDeleteField = 'is_active' } = options;

      let query;

      if (softDelete) {
        query = supabase
          .from(table)
          .update({ [softDeleteField]: false })
          .eq('id', id);
      } else {
        query = supabase.from(table).delete().eq('id', id);
      }

      if (returning) {
        query = query.select(selection).single();
      }

      const result = await query;

      if (result?.error) {
        throw new Error(`Delete failed: ${result.error.message}`);
      }

      if (returning && !result.data) {
        return {
          success: false,
          statusCode: 404,
          message: `Record with ID ${id} not found for deletion`,
          data: null,
          meta: null,
        };
      }

      return {
        success: true,
        statusCode: 200,
        message: `Record ${softDelete ? 'soft deleted' : 'deleted'} successfully`,
        data: returning ? (result.data as T) : ({ id } as T),
        meta: null,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

      return {
        success: false,
        statusCode: 500,
        message: `Delete operation failed: ${errorMessage}`,
        data: null,
        meta: null,
      };
    }
  },

  async rawQuery<T = any>(
    supabase: SupabaseClient,
    table: string,
    options: {
      method?: 'select' | 'insert' | 'update' | 'upsert' | 'delete';
      values?: any;
      selection?: string;
      filters?: { type: string; column: string; value: any }[];
      order?: { column: string; ascending?: boolean };
      range?: { from: number; to: number };
      single?: boolean;
      maybeSingle?: boolean;
      onConflict?: string;
      ignoreDuplicates?: boolean;
      selectOptions?: any;
    } = {},
  ): Promise<IBaseResponse<T | T[]>> {
    const {
      method = 'select',
      values,
      selection = '*',
      filters = [],
      order,
      range,
      single = false,
      maybeSingle = false,
      onConflict,
      ignoreDuplicates,
      selectOptions,
    } = options;

    try {
      let query: any = supabase.from(table);

      if (method === 'select') {
        query = query.select(selection, selectOptions);
      } else if (method === 'insert') {
        query = query.insert(values).select(selection);
      } else if (method === 'update') {
        query = query.update(values).select(selection);
      } else if (method === 'upsert') {
        query = query.upsert(values, { ...(onConflict && { onConflict }), ignoreDuplicates }).select(selection);
      } else if (method === 'delete') {
        query = query.delete();
      }

      filters.forEach((filter) => {
        if (filter.type && filter.column) {
          if (Array.isArray(filter.value) && (filter.type === 'in' || filter.type === 'notin')) {
            if (filter.type === 'in') query = query.in(filter.column, filter.value);
            if (filter.type === 'notin') query = query.not(filter.column, 'in', `(${filter.value.join(',')})`);
          } else if (typeof query[filter.type] === 'function') {
            query = query[filter.type](filter.column, filter.value);
          }
        }
      });

      if (order && order.column) {
        query = query.order(order.column, { ascending: order.ascending !== false });
      }

      if (range && typeof range.from === 'number' && typeof range.to === 'number') {
        query = query.range(range.from, range.to);
      }

      if (single && typeof query.single === 'function') {
        query = query.single();
      } else if (maybeSingle && typeof query.maybeSingle === 'function') {
        query = query.maybeSingle();
      }

      const result = await query;

      if (result?.error) {
        throw new Error(result.error.message);
      }

      const data: T | T[] =
        single || maybeSingle
          ? result.data
          : Array.isArray(result.data)
            ? result.data
            : result.data
              ? [result.data]
              : [];

      return {
        success: true,
        statusCode: 200,
        message: 'Query executed successfully',
        data,
        meta: null,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

      return {
        success: false,
        statusCode: 500,
        message: `Query execution failed: ${errorMessage}`,
        data: single || maybeSingle ? null : [],
        meta: null,
      };
    }
  },
};
