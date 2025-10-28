import { IBaseResponse, TId } from '@base/interfaces';
import { supabaseBrowserClient } from '@lib/config/supabase/browserClient';
import { Database } from '@lib/constant/database';
import { responseHandlerFn } from '@lib/utils/errorHandler';
import { SupabaseAdapter } from '@lib/utils/supabaseAdapter';
import { IFeature, IFeatureCreate, IFeaturesFilter, IFeaturesResponse } from './interfaces';

const END_POINT: string = Database.features;

export const FeaturesServices = {
  NAME: END_POINT,

  findById: async (id: TId): Promise<IBaseResponse<IFeature>> => {
    try {
      const res = await SupabaseAdapter.findById<IFeature>(supabaseBrowserClient, END_POINT, id);
      return Promise.resolve(res);
    } catch (error) {
      throw responseHandlerFn(error);
    }
  },

  find: async (filters: IFeaturesFilter): Promise<IFeaturesResponse> => {
    const { start_date, end_date, ...restFilters } = filters;
    const newFilters: any = { ...restFilters };

    if (start_date) {
      newFilters.start_date = decodeURIComponent(start_date);
    }

    if (end_date) {
      newFilters.end_date = decodeURIComponent(end_date);
    }

    try {
      const res = await SupabaseAdapter.find<IFeature>(supabaseBrowserClient, END_POINT, newFilters);
      return Promise.resolve(res);
    } catch (error) {
      throw responseHandlerFn(error);
    }
  },

  create: async (payload: IFeatureCreate): Promise<IBaseResponse<IFeature>> => {
    try {
      const res = await SupabaseAdapter.create<IFeature>(supabaseBrowserClient, END_POINT, payload);
      return Promise.resolve(res);
    } catch (error) {
      throw responseHandlerFn(error);
    }
  },

  update: async (payload: { id: TId; data: Partial<IFeatureCreate> }): Promise<IBaseResponse<IFeature>> => {
    try {
      const res = await SupabaseAdapter.update<IFeature>(supabaseBrowserClient, END_POINT, payload.id, payload.data);
      return Promise.resolve(res);
    } catch (error) {
      throw responseHandlerFn(error);
    }
  },

  delete: async (id: TId): Promise<IBaseResponse<IFeature>> => {
    try {
      const res = await SupabaseAdapter.delete<IFeature>(supabaseBrowserClient, END_POINT, id);
      return Promise.resolve(res);
    } catch (error) {
      throw responseHandlerFn(error);
    }
  },
};
