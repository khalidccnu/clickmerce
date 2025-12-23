import { Env } from '.environments';
import { IBaseResponse, TId } from '@base/interfaces';
import { AxiosSecureInstance } from '@lib/config/axiosInstance';
import { supabaseBrowserClient } from '@lib/config/supabase/browserClient';
import { Database } from '@lib/constant/database';
import { Paths } from '@lib/constant/paths';
import { responseHandlerFn } from '@lib/utils/errorHandler';
import { SupabaseAdapter } from '@lib/utils/supabaseAdapter';
import { IBanner, IBannerCreate, IBannersFilter, IBannersResponse } from './interfaces';

const END_POINT: string = Database.banners;

export const BannersServices = {
  NAME: END_POINT,

  findById: async (id: TId): Promise<IBaseResponse<IBanner>> => {
    try {
      const res = await SupabaseAdapter.findById<IBanner>(supabaseBrowserClient, END_POINT, id);
      return Promise.resolve(res);
    } catch (error) {
      throw responseHandlerFn(error);
    }
  },

  find: async (filters: IBannersFilter): Promise<IBannersResponse> => {
    const { start_date, end_date, ...restFilters } = filters;
    const newFilters: any = { ...restFilters };

    if (start_date) {
      newFilters.start_date = decodeURIComponent(start_date);
    }

    if (end_date) {
      newFilters.end_date = decodeURIComponent(end_date);
    }

    try {
      const res = await SupabaseAdapter.find<IBanner>(supabaseBrowserClient, END_POINT, newFilters);
      return Promise.resolve(res);
    } catch (error) {
      throw responseHandlerFn(error);
    }
  },

  create: async (payload: IBannerCreate): Promise<IBaseResponse<IBanner>> => {
    try {
      const res = await SupabaseAdapter.create<IBanner>(supabaseBrowserClient, END_POINT, payload);

      await AxiosSecureInstance.post('/revalidate', {
        secret: Env.revalidationSecret,
        route: Paths.root,
      });

      return Promise.resolve(res);
    } catch (error) {
      throw responseHandlerFn(error);
    }
  },

  update: async (payload: { id: TId; data: Partial<IBannerCreate> }): Promise<IBaseResponse<IBanner>> => {
    try {
      const res = await SupabaseAdapter.update<IBanner>(supabaseBrowserClient, END_POINT, payload.id, payload.data);

      await AxiosSecureInstance.post('/revalidate', {
        secret: Env.revalidationSecret,
        route: Paths.root,
      });

      return Promise.resolve(res);
    } catch (error) {
      throw responseHandlerFn(error);
    }
  },

  delete: async (id: TId): Promise<IBaseResponse<IBanner>> => {
    try {
      const res = await SupabaseAdapter.delete<IBanner>(supabaseBrowserClient, END_POINT, id);

      await AxiosSecureInstance.post('/revalidate', {
        secret: Env.revalidationSecret,
        route: Paths.root,
      });

      return Promise.resolve(res);
    } catch (error) {
      throw responseHandlerFn(error);
    }
  },
};
