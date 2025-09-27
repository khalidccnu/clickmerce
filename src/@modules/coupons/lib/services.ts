import { IBaseResponse, TId } from '@base/interfaces';
import { supabaseBrowserClient } from '@lib/config/supabase/browserClient';
import { Database } from '@lib/constant/database';
import { responseHandlerFn } from '@lib/utils/errorHandler';
import { SupabaseAdapter } from '@lib/utils/supabaseAdapter';
import { ICoupon, ICouponCreate, ICouponsFilter, ICouponsResponse } from './interfaces';

const END_POINT: string = Database.coupons;

export const CouponsServices = {
  NAME: END_POINT,

  findById: async (id: TId): Promise<IBaseResponse<ICoupon>> => {
    try {
      const res = await SupabaseAdapter.findById<ICoupon>(supabaseBrowserClient, END_POINT, id);
      return Promise.resolve(res);
    } catch (error) {
      throw responseHandlerFn(error);
    }
  },

  find: async (filters: ICouponsFilter): Promise<ICouponsResponse> => {
    const { start_date, end_date, ...restFilters } = filters;
    const newFilters: any = { ...restFilters };

    if (start_date) {
      newFilters.start_date = decodeURIComponent(start_date);
    }

    if (end_date) {
      newFilters.end_date = decodeURIComponent(end_date);
    }

    try {
      const res = await SupabaseAdapter.find<ICoupon>(supabaseBrowserClient, END_POINT, newFilters);
      return Promise.resolve(res);
    } catch (error) {
      throw responseHandlerFn(error);
    }
  },

  create: async (payload: ICouponCreate): Promise<IBaseResponse<ICoupon>> => {
    try {
      const res = await SupabaseAdapter.create<ICoupon>(supabaseBrowserClient, END_POINT, payload);
      return Promise.resolve(res);
    } catch (error) {
      throw responseHandlerFn(error);
    }
  },

  update: async (payload: { id: TId; data: Partial<ICouponCreate> }): Promise<IBaseResponse<ICoupon>> => {
    try {
      const res = await SupabaseAdapter.update<ICoupon>(supabaseBrowserClient, END_POINT, payload.id, payload.data);
      return Promise.resolve(res);
    } catch (error) {
      throw responseHandlerFn(error);
    }
  },
};
