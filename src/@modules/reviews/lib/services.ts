import { IBaseResponse, TId } from '@base/interfaces';
import { supabaseBrowserClient } from '@lib/config/supabase/browserClient';
import { Database } from '@lib/constant/database';
import { responseHandlerFn } from '@lib/utils/errorHandler';
import { buildSelectionFn, SupabaseAdapter } from '@lib/utils/supabaseAdapter';
import { Toolbox } from '@lib/utils/toolbox';
import { IReview, IReviewCreate, IReviewsFilter, IReviewsResponse } from './interfaces';

const END_POINT: string = Database.reviews;

export const ReviewsServices = {
  NAME: END_POINT,

  findById: async (id: TId): Promise<IBaseResponse<IReview>> => {
    try {
      const res = await SupabaseAdapter.findById<IReview>(supabaseBrowserClient, END_POINT, id);
      return Promise.resolve(res);
    } catch (error) {
      throw responseHandlerFn(error);
    }
  },

  find: async (filters: IReviewsFilter): Promise<IReviewsResponse> => {
    const { start_date, end_date, ...restFilters } = filters;
    const newFilters: any = { ...restFilters };

    if (start_date) {
      newFilters.start_date = decodeURIComponent(start_date);
    }

    if (end_date) {
      newFilters.end_date = decodeURIComponent(end_date);
    }

    try {
      const res = await SupabaseAdapter.find<IReview>(supabaseBrowserClient, END_POINT, newFilters, {
        selection: buildSelectionFn({
          relations: {
            user: {
              table: Database.users,
              columns: ['id', 'name', 'phone', 'email'],
            },
            product: {
              table: Database.products,
            },
          },
          filters: newFilters,
        }),
      });
      return Promise.resolve(res);
    } catch (error) {
      throw responseHandlerFn(error);
    }
  },

  create: async (payload: IReviewCreate): Promise<IBaseResponse<IReview>> => {
    try {
      const res = await SupabaseAdapter.create<IReview>(supabaseBrowserClient, END_POINT, payload);
      return Promise.resolve(res);
    } catch (error) {
      throw responseHandlerFn(error);
    }
  },

  update: async (payload: { id: TId; data: Partial<IReviewCreate> }): Promise<IBaseResponse<IReview>> => {
    try {
      const res = await SupabaseAdapter.update<IReview>(
        supabaseBrowserClient,
        END_POINT,
        payload.id,
        Toolbox.toNullifyTraverse(payload.data),
      );
      return Promise.resolve(res);
    } catch (error) {
      throw responseHandlerFn(error);
    }
  },

  delete: async (id: TId): Promise<IBaseResponse<IReview>> => {
    try {
      const res = await SupabaseAdapter.delete<IReview>(supabaseBrowserClient, END_POINT, id);
      return Promise.resolve(res);
    } catch (error) {
      throw responseHandlerFn(error);
    }
  },
};
