import { IBaseResponse, TId } from '@base/interfaces';
import { supabaseBrowserClient } from '@lib/config/supabase/browserClient';
import { Database } from '@lib/constant/database';
import { responseHandlerFn } from '@lib/utils/errorHandler';
import { SupabaseAdapter } from '@lib/utils/supabaseAdapter';
import {
  IDeliveryServiceType,
  IDeliveryServiceTypeCreate,
  IDeliveryServiceTypesFilter,
  IDeliveryServiceTypesResponse,
} from './interfaces';

const END_POINT: string = Database.deliveryServiceTypes;

export const DeliveryServiceTypesServices = {
  NAME: END_POINT,

  findById: async (id: TId): Promise<IBaseResponse<IDeliveryServiceType>> => {
    try {
      const res = await SupabaseAdapter.findById<IDeliveryServiceType>(supabaseBrowserClient, END_POINT, id);
      return Promise.resolve(res);
    } catch (error) {
      throw responseHandlerFn(error);
    }
  },

  find: async (filters: IDeliveryServiceTypesFilter): Promise<IDeliveryServiceTypesResponse> => {
    const { start_date, end_date, ...restFilters } = filters;
    const newFilters: any = { ...restFilters };

    if (start_date) {
      newFilters.start_date = decodeURIComponent(start_date);
    }

    if (end_date) {
      newFilters.end_date = decodeURIComponent(end_date);
    }

    try {
      const res = await SupabaseAdapter.find<IDeliveryServiceType>(supabaseBrowserClient, END_POINT, newFilters);
      return Promise.resolve(res);
    } catch (error) {
      throw responseHandlerFn(error);
    }
  },

  create: async (payload: IDeliveryServiceTypeCreate): Promise<IBaseResponse<IDeliveryServiceType>> => {
    try {
      const res = await SupabaseAdapter.create<IDeliveryServiceType>(supabaseBrowserClient, END_POINT, payload);
      return Promise.resolve(res);
    } catch (error) {
      throw responseHandlerFn(error);
    }
  },

  update: async (payload: {
    id: TId;
    data: Partial<IDeliveryServiceTypeCreate>;
  }): Promise<IBaseResponse<IDeliveryServiceType>> => {
    try {
      const res = await SupabaseAdapter.update<IDeliveryServiceType>(
        supabaseBrowserClient,
        END_POINT,
        payload.id,
        payload.data,
      );
      return Promise.resolve(res);
    } catch (error) {
      throw responseHandlerFn(error);
    }
  },
};
