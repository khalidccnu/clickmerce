import { IBaseResponse, TId } from '@base/interfaces';
import { AxiosInstance } from '@lib/config/axiosInstance';
import { supabaseBrowserClient } from '@lib/config/supabase/browserClient';
import { Database } from '@lib/constant/database';
import { responseHandlerFn } from '@lib/utils/errorHandler';
import { SupabaseAdapter } from '@lib/utils/supabaseAdapter';
import { Toolbox } from '@lib/utils/toolbox';
import dayjs from 'dayjs';
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
    const { is_valid, start_date, end_date, ...restFilters } = filters;
    const newFilters: any = { ...restFilters };

    if (is_valid) {
      const now = dayjs();

      if (Toolbox.toBool(is_valid)) {
        newFilters.dateFilters = {
          conditions: {
            valid_from: { lte: now.toISOString() },
            valid_until: { gte: now.toISOString() },
          },
        };
      } else {
        newFilters.dateFilters = {
          type: 'or',
          conditions: {
            valid_from: { gt: now.toISOString() },
            valid_until: { lt: now.toISOString() },
          },
        };
      }
    }

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

  validate: async (payload: {
    code: TId;
    products: {
      id: TId;
      variation_id: TId;
      selected_quantity: number;
    }[];
  }): Promise<IBaseResponse<{ discount: number }>> => {
    try {
      const res = await AxiosInstance.post(`/${END_POINT}/validate`, payload);
      return Promise.resolve(res?.data);
    } catch (error) {
      throw responseHandlerFn(error);
    }
  },
};
