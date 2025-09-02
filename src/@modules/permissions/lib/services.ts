import { IBaseResponse, TId } from '@base/interfaces';
import { supabaseBrowserClient } from '@lib/config/supabase/browserClient';
import { Database } from '@lib/constant/database';
import { responseHandlerFn } from '@lib/utils/errorHandler';
import { SupabaseAdapter } from '@lib/utils/supabaseAdapter';
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
    try {
      const res = await SupabaseAdapter.find<IPermission>(supabaseBrowserClient, END_POINT, filters, {
        selection: '*, permission_type:permission_types(*)',
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
