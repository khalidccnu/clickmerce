import { IBaseResponse, TId } from '@base/interfaces';
import { supabaseBrowserClient } from '@lib/config/supabase/browserClient';
import { Database } from '@lib/constant/database';
import { responseHandlerFn } from '@lib/utils/errorHandler';
import { SupabaseAdapter } from '@lib/utils/supabaseAdapter';
import { ICategoriesFilter, ICategoriesResponse, ICategory, ICategoryCreate } from './interfaces';

const END_POINT: string = Database.categories;

export const CategoriesServices = {
  NAME: END_POINT,

  findById: async (id: TId): Promise<IBaseResponse<ICategory>> => {
    try {
      const res = await SupabaseAdapter.findById<ICategory>(supabaseBrowserClient, END_POINT, id);
      return Promise.resolve(res);
    } catch (error) {
      throw responseHandlerFn(error);
    }
  },

  findSpecifics: async (categoryIds: TId[]): Promise<ICategoriesResponse> => {
    try {
      const res = await SupabaseAdapter.findByIds<ICategory>(supabaseBrowserClient, END_POINT, categoryIds);
      return Promise.resolve(res);
    } catch (error) {
      throw responseHandlerFn(error);
    }
  },

  find: async (filters: ICategoriesFilter): Promise<ICategoriesResponse> => {
    const { start_date, end_date, ...restFilters } = filters;
    const newFilters: any = { ...restFilters };

    if (start_date) {
      newFilters.start_date = decodeURIComponent(start_date);
    }

    if (end_date) {
      newFilters.end_date = decodeURIComponent(end_date);
    }

    try {
      const res = await SupabaseAdapter.find<ICategory>(supabaseBrowserClient, END_POINT, newFilters);
      return Promise.resolve(res);
    } catch (error) {
      throw responseHandlerFn(error);
    }
  },

  create: async (payload: ICategoryCreate): Promise<IBaseResponse<ICategory>> => {
    try {
      const res = await SupabaseAdapter.create<ICategory>(supabaseBrowserClient, END_POINT, payload);
      return Promise.resolve(res);
    } catch (error) {
      throw responseHandlerFn(error);
    }
  },

  update: async (payload: { id: TId; data: Partial<ICategoryCreate> }): Promise<IBaseResponse<ICategory>> => {
    try {
      const res = await SupabaseAdapter.update<ICategory>(supabaseBrowserClient, END_POINT, payload.id, payload.data);
      return Promise.resolve(res);
    } catch (error) {
      throw responseHandlerFn(error);
    }
  },

  delete: async (id: TId): Promise<IBaseResponse<ICategory>> => {
    try {
      const res = await SupabaseAdapter.delete<ICategory>(supabaseBrowserClient, END_POINT, id);
      return Promise.resolve(res);
    } catch (error) {
      throw responseHandlerFn(error);
    }
  },
};
