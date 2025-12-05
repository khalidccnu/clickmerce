import { IBaseResponse, TId } from '@base/interfaces';
import { supabaseBrowserClient } from '@lib/config/supabase/browserClient';
import { Database } from '@lib/constant/database';
import { responseHandlerFn } from '@lib/utils/errorHandler';
import { buildSelectionFn, SupabaseAdapter } from '@lib/utils/supabaseAdapter';
import { IPermission, IPermissionCreate, IPermissionsFilter, IPermissionsResponse } from './interfaces';

const END_POINT: string = Database.permissions;

export const PermissionsServices = {
  NAME: END_POINT,

  findById: async (id: TId): Promise<IBaseResponse<IPermission>> => {
    try {
      const res = await SupabaseAdapter.findById<IPermission>(supabaseBrowserClient, END_POINT, id);
      return Promise.resolve(res);
    } catch (error) {
      throw responseHandlerFn(error);
    }
  },

  find: async (filters: IPermissionsFilter): Promise<IPermissionsResponse> => {
    const { start_date, end_date, ...restFilters } = filters;
    const newFilters: any = { ...restFilters };

    if (start_date) {
      newFilters.start_date = decodeURIComponent(start_date);
    }

    if (end_date) {
      newFilters.end_date = decodeURIComponent(end_date);
    }

    try {
      const res = await SupabaseAdapter.find<IPermission>(supabaseBrowserClient, END_POINT, newFilters, {
        selection: buildSelectionFn({ relations: { permission_type: { table: Database.permissionTypes } } }),
      });
      return Promise.resolve(res);
    } catch (error) {
      throw responseHandlerFn(error);
    }
  },

  create: async (payload: IPermissionCreate): Promise<IBaseResponse<IPermission>> => {
    try {
      const res = await SupabaseAdapter.create<IPermission>(supabaseBrowserClient, END_POINT, payload);
      return Promise.resolve(res);
    } catch (error) {
      throw responseHandlerFn(error);
    }
  },

  update: async (payload: { id: TId; data: Partial<IPermissionCreate> }): Promise<IBaseResponse<IPermission>> => {
    try {
      const res = await SupabaseAdapter.update<IPermission>(supabaseBrowserClient, END_POINT, payload.id, payload.data);
      return Promise.resolve(res);
    } catch (error) {
      throw responseHandlerFn(error);
    }
  },
};
