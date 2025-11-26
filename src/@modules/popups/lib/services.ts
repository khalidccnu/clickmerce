import { IBaseResponse, TId } from '@base/interfaces';
import { supabaseBrowserClient } from '@lib/config/supabase/browserClient';
import { Database } from '@lib/constant/database';
import { responseHandlerFn } from '@lib/utils/errorHandler';
import { SupabaseAdapter } from '@lib/utils/supabaseAdapter';
import { Toolbox } from '@lib/utils/toolbox';
import { IPopup, IPopupCreate, IPopupsFilter, IPopupsResponse } from './interfaces';

const END_POINT: string = Database.popups;

export const PopupsServices = {
  NAME: END_POINT,

  findById: async (id: TId): Promise<IBaseResponse<IPopup>> => {
    try {
      const res = await SupabaseAdapter.findById<IPopup>(supabaseBrowserClient, END_POINT, id);
      return Promise.resolve(res);
    } catch (error) {
      throw responseHandlerFn(error);
    }
  },

  find: async (filters: IPopupsFilter): Promise<IPopupsResponse> => {
    const { start_date, end_date, ...restFilters } = filters;
    const newFilters: any = { ...restFilters };

    if (start_date) {
      newFilters.start_date = decodeURIComponent(start_date);
    }

    if (end_date) {
      newFilters.end_date = decodeURIComponent(end_date);
    }

    try {
      const res = await SupabaseAdapter.find<IPopup>(supabaseBrowserClient, END_POINT, newFilters);
      return Promise.resolve(res);
    } catch (error) {
      throw responseHandlerFn(error);
    }
  },

  create: async (payload: IPopupCreate): Promise<IBaseResponse<IPopup>> => {
    try {
      if (Toolbox.toBool(payload.is_active)) {
        const {
          success,
          message,
          data: popup,
          ...rest
        } = await SupabaseAdapter.findOne<IPopup>(supabaseBrowserClient, END_POINT, {
          is_active: true,
        });

        if (!success) {
          return Promise.resolve({
            success,
            message: message || 'Error checking existing popup',
            data: null,
            ...rest,
          });
        }

        if (popup) {
          return Promise.resolve({
            success: false,
            message: `Popup already exists with active status`,
            data: null,
            ...rest,
          });
        }
      }

      const res = await SupabaseAdapter.create<IPopup>(supabaseBrowserClient, END_POINT, payload);
      return Promise.resolve(res);
    } catch (error) {
      throw responseHandlerFn(error);
    }
  },

  update: async (payload: { id: TId; data: Partial<IPopupCreate> }): Promise<IBaseResponse<IPopup>> => {
    try {
      if (Toolbox.toBool(payload.data.is_active)) {
        const {
          success,
          message,
          data: popup,
          ...rest
        } = await SupabaseAdapter.findOne<IPopup>(supabaseBrowserClient, END_POINT, {
          textFilters: {
            conditions: {
              id: { neq: payload.id as string },
            },
          },
          booleanFilters: {
            conditions: {
              is_active: {
                eq: true,
              },
            },
          },
        });

        if (!success) {
          return Promise.resolve({
            success,
            message: message || 'Error checking existing popup',
            data: null,
            ...rest,
          });
        }

        if (popup) {
          return Promise.resolve({
            success: false,
            message: `Popup already exists with active status`,
            data: null,
            ...rest,
          });
        }
      }

      const res = await SupabaseAdapter.update<IPopup>(supabaseBrowserClient, END_POINT, payload.id, payload.data);
      return Promise.resolve(res);
    } catch (error) {
      throw responseHandlerFn(error);
    }
  },

  delete: async (id: TId): Promise<IBaseResponse<IPopup>> => {
    try {
      const res = await SupabaseAdapter.delete<IPopup>(supabaseBrowserClient, END_POINT, id);
      return Promise.resolve(res);
    } catch (error) {
      throw responseHandlerFn(error);
    }
  },
};
