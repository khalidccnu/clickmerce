import { IBaseResponse, TId } from '@base/interfaces';
import { AxiosInstance, AxiosSecureInstance } from '@lib/config/axiosInstance';
import { supabaseBrowserClient } from '@lib/config/supabase/browserClient';
import { Database } from '@lib/constant/database';
import { responseHandlerFn } from '@lib/utils/errorHandler';
import { SupabaseAdapter } from '@lib/utils/supabaseAdapter';
import { Toolbox } from '@lib/utils/toolbox';
import { AxiosResponse } from 'axios';
import { IGalleriesFilter, IGalleriesResponse, IGallery, IGalleryCreate } from './interfaces';

const END_POINT: string = Database.galleries;

export const GalleriesServices = {
  NAME: END_POINT,

  findById: async (id: TId): Promise<IBaseResponse<IGallery>> => {
    try {
      const res = await SupabaseAdapter.findById<IGallery>(supabaseBrowserClient, END_POINT, id);
      return Promise.resolve(res);
    } catch (error) {
      throw responseHandlerFn(error);
    }
  },

  find: async (filters: IGalleriesFilter): Promise<IGalleriesResponse> => {
    const { start_date, end_date, ...restFilters } = filters;
    const newFilters: any = { ...restFilters };

    if (start_date) {
      newFilters.start_date = decodeURIComponent(start_date);
    }

    if (end_date) {
      newFilters.end_date = decodeURIComponent(end_date);
    }

    try {
      const res = await SupabaseAdapter.find<IGallery>(supabaseBrowserClient, END_POINT, newFilters);
      return Promise.resolve(res);
    } catch (error) {
      throw responseHandlerFn(error);
    }
  },

  create: async (payload: IGalleryCreate): Promise<IGalleriesResponse> => {
    try {
      let res: IGalleriesResponse;
      const { data } = await AxiosSecureInstance.post('/uploads', payload);

      if (Toolbox.isNotEmpty(data?.data)) {
        res = await SupabaseAdapter.batchCreate<IGallery>(supabaseBrowserClient, END_POINT, data.data);
      }

      return Promise.resolve(res);
    } catch (error) {
      throw responseHandlerFn(error);
    }
  },

  quickCreate: async (payload: IGalleryCreate): Promise<IGalleriesResponse> => {
    try {
      let res: AxiosResponse<IGalleriesResponse>;
      const { data } = await AxiosSecureInstance.post('/uploads', payload);

      if (Toolbox.isNotEmpty(data?.data)) {
        res = await AxiosInstance.post(`/${END_POINT}/quick`, { items: data?.data });
      }
      return Promise.resolve(res?.data);
    } catch (error) {
      throw responseHandlerFn(error);
    }
  },

  update: async (payload: { id: TId; data: Partial<IGallery> }): Promise<IBaseResponse<IGallery>> => {
    try {
      const res = await SupabaseAdapter.update<IGallery>(supabaseBrowserClient, END_POINT, payload.id, payload.data);
      return Promise.resolve(res);
    } catch (error) {
      throw responseHandlerFn(error);
    }
  },

  delete: async (id: TId): Promise<IBaseResponse<IGallery>> => {
    try {
      let res: IBaseResponse<IGallery>;
      const { success, data } = await SupabaseAdapter.findById<IGallery>(supabaseBrowserClient, END_POINT, id);

      if (success && data) {
        const { data: deleteData } = await AxiosSecureInstance.delete(`/uploads/${data?.file_path}`);

        if (deleteData?.success) {
          res = await SupabaseAdapter.delete<IGallery>(supabaseBrowserClient, END_POINT, id);
        }
      }

      return Promise.resolve(res);
    } catch (error) {
      throw responseHandlerFn(error);
    }
  },
};
