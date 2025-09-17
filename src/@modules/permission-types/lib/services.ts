import { IBaseFilter, IBaseResponse, TId } from '@base/interfaces';
import { supabaseBrowserClient } from '@lib/config/supabase/browserClient';
import { Database } from '@lib/constant/database';
import { responseHandlerFn } from '@lib/utils/errorHandler';
import { SupabaseAdapter } from '@lib/utils/supabaseAdapter';
import { IPermissionType, IPermissionTypeCreate, IPermissionTypesResponse } from './interfaces';

const END_POINT: string = Database.permissionTypes;

export const PermissionTypesServices = {
  NAME: END_POINT,

  findById: async (id: TId): Promise<IBaseResponse<IPermissionType>> => {
    try {
      const res = await SupabaseAdapter.findById<IPermissionType>(supabaseBrowserClient, END_POINT, id);
      return Promise.resolve(res);
    } catch (error) {
      throw responseHandlerFn(error);
    }
  },

  find: async (filters: IBaseFilter): Promise<IPermissionTypesResponse> => {
    const { start_date, end_date, ...restFilters } = filters;
    const newFilters: any = { ...restFilters };

    if (start_date) {
      newFilters.start_date = decodeURIComponent(start_date);
    }

    if (end_date) {
      newFilters.end_date = decodeURIComponent(end_date);
    }

    try {
      const res = await SupabaseAdapter.find<IPermissionType>(supabaseBrowserClient, END_POINT, newFilters);
      return Promise.resolve(res);
    } catch (error) {
      throw responseHandlerFn(error);
    }
  },

  create: async (payload: IPermissionTypeCreate): Promise<IBaseResponse<IPermissionType>> => {
    try {
      const res = await SupabaseAdapter.create<IPermissionType>(supabaseBrowserClient, END_POINT, payload);
      return Promise.resolve(res);
    } catch (error) {
      throw responseHandlerFn(error);
    }
  },

  update: async (payload: {
    id: TId;
    data: Partial<IPermissionTypeCreate>;
  }): Promise<IBaseResponse<IPermissionType>> => {
    try {
      const res = await SupabaseAdapter.update<IPermissionType>(
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
