import { IBaseResponse, TId } from '@base/interfaces';
import { supabaseBrowserClient } from '@lib/config/supabase/browserClient';
import { Database } from '@lib/constant/database';
import { responseHandlerFn } from '@lib/utils/errorHandler';
import { SupabaseAdapter } from '@lib/utils/supabaseAdapter';
import { IPage, IPageCreate, IPagesFilter, IPagesResponse } from './interfaces';

const END_POINT: string = Database.pages;

export const PagesServices = {
  NAME: END_POINT,

  findById: async (id: TId): Promise<IBaseResponse<IPage>> => {
    try {
      const res = await SupabaseAdapter.findById<IPage>(supabaseBrowserClient, END_POINT, id);
      return Promise.resolve(res);
    } catch (error) {
      throw responseHandlerFn(error);
    }
  },

  find: async (filters: IPagesFilter): Promise<IPagesResponse> => {
    const { start_date, end_date, ...restFilters } = filters;
    const newFilters: any = { ...restFilters };

    if (start_date) {
      newFilters.start_date = decodeURIComponent(start_date);
    }

    if (end_date) {
      newFilters.end_date = decodeURIComponent(end_date);
    }

    try {
      const res = await SupabaseAdapter.find<IPage>(supabaseBrowserClient, END_POINT, newFilters);
      return Promise.resolve(res);
    } catch (error) {
      throw responseHandlerFn(error);
    }
  },

  create: async (payload: IPageCreate): Promise<IBaseResponse<IPage>> => {
    try {
      const { success, message, data, ...rest } = await SupabaseAdapter.find<IPage>(supabaseBrowserClient, END_POINT, {
        textFilters: {
          conditions: {
            type: { eq: payload.type },
          },
        },
      });

      if (!success) {
        return Promise.resolve({
          success,
          message: message || 'Error checking existing page.',
          data: null,
          ...rest,
        });
      }

      if (data && data.length) {
        return Promise.resolve({
          success: false,
          message: `Page with type '${payload.type}' already exists.`,
          data: null,
          ...rest,
        });
      }

      const res = await SupabaseAdapter.create<IPage>(supabaseBrowserClient, END_POINT, payload);
      return Promise.resolve(res);
    } catch (error) {
      throw responseHandlerFn(error);
    }
  },

  update: async (payload: { id: TId; data: Partial<IPageCreate> }): Promise<IBaseResponse<IPage>> => {
    try {
      if (payload.data.type) {
        const { success, message, data, ...rest } = await SupabaseAdapter.find<IPage>(
          supabaseBrowserClient,
          END_POINT,
          {
            textFilters: {
              conditions: {
                id: { neq: payload.id as string },
                type: { eq: payload.data.type },
              },
            },
          },
        );

        if (!success) {
          return Promise.resolve({
            success,
            message: message || 'Error checking existing page.',
            data: null,
            ...rest,
          });
        }

        if (data && data.length) {
          return Promise.resolve({
            success: false,
            message: `Page with type '${payload.data.type}' already exists.`,
            data: null,
            ...rest,
          });
        }
      }

      const res = await SupabaseAdapter.update<IPage>(supabaseBrowserClient, END_POINT, payload.id, payload.data);
      return Promise.resolve(res);
    } catch (error) {
      throw responseHandlerFn(error);
    }
  },

  delete: async (id: TId): Promise<IBaseResponse<IPage>> => {
    try {
      const res = await SupabaseAdapter.delete<IPage>(supabaseBrowserClient, END_POINT, id);
      return Promise.resolve(res);
    } catch (error) {
      throw responseHandlerFn(error);
    }
  },
};
