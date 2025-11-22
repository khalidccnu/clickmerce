import { IBaseResponse, TId } from '@base/interfaces';
import { supabaseBrowserClient } from '@lib/config/supabase/browserClient';
import { Database } from '@lib/constant/database';
import { responseHandlerFn } from '@lib/utils/errorHandler';
import { buildSelectionFn, SupabaseAdapter } from '@lib/utils/supabaseAdapter';
import { IDeliveryZone, IDeliveryZoneCreate, IDeliveryZonesFilter, IDeliveryZonesResponse } from './interfaces';

const END_POINT: string = Database.deliveryZones;

export const DeliveryZonesServices = {
  NAME: END_POINT,

  findById: async (id: TId): Promise<IBaseResponse<IDeliveryZone>> => {
    try {
      const res = await SupabaseAdapter.findById<IDeliveryZone>(supabaseBrowserClient, END_POINT, id, {
        selection: buildSelectionFn({ relations: { delivery_service_type: { table: Database.deliveryServiceTypes } } }),
      });
      return Promise.resolve(res);
    } catch (error) {
      throw responseHandlerFn(error);
    }
  },

  find: async (filters: IDeliveryZonesFilter): Promise<IDeliveryZonesResponse> => {
    const { start_date, end_date, ...restFilters } = filters;
    const newFilters: any = { ...restFilters };

    if (start_date) {
      newFilters.start_date = decodeURIComponent(start_date);
    }

    if (end_date) {
      newFilters.end_date = decodeURIComponent(end_date);
    }

    try {
      const res = await SupabaseAdapter.find<IDeliveryZone>(supabaseBrowserClient, END_POINT, newFilters, {
        selection: buildSelectionFn({ relations: { delivery_service_type: { table: Database.deliveryServiceTypes } } }),
      });
      return Promise.resolve(res);
    } catch (error) {
      throw responseHandlerFn(error);
    }
  },

  create: async (payload: IDeliveryZoneCreate): Promise<IBaseResponse<IDeliveryZone>> => {
    try {
      const res = await SupabaseAdapter.create<IDeliveryZone>(supabaseBrowserClient, END_POINT, payload);
      return Promise.resolve(res);
    } catch (error) {
      throw responseHandlerFn(error);
    }
  },

  update: async (payload: { id: TId; data: Partial<IDeliveryZoneCreate> }): Promise<IBaseResponse<IDeliveryZone>> => {
    try {
      const res = await SupabaseAdapter.update<IDeliveryZone>(
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
