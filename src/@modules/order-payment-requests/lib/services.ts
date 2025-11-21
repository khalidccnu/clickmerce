import { IBaseResponse, TId } from '@base/interfaces';
import { AxiosInstance } from '@lib/config/axiosInstance';
import { supabaseBrowserClient } from '@lib/config/supabase/browserClient';
import { Database } from '@lib/constant/database';
import { responseHandlerFn } from '@lib/utils/errorHandler';
import { buildSelectionFn, SupabaseAdapter } from '@lib/utils/supabaseAdapter';
import {
  IOrderPaymentRequest,
  IOrderPaymentRequestCreate,
  IOrderPaymentRequestsFilter,
  IOrderPaymentRequestsResponse,
} from './interfaces';

const END_POINT: string = Database.orderPaymentRequests;

export const OrderPaymentRequestsServices = {
  NAME: END_POINT,

  findById: async (id: TId): Promise<IBaseResponse<IOrderPaymentRequest>> => {
    try {
      const res = await SupabaseAdapter.findById<IOrderPaymentRequest>(supabaseBrowserClient, END_POINT, id);
      return Promise.resolve(res);
    } catch (error) {
      throw responseHandlerFn(error);
    }
  },

  find: async (filters: IOrderPaymentRequestsFilter): Promise<IOrderPaymentRequestsResponse> => {
    const { start_date, end_date, customer_id, ...restFilters } = filters;
    const newFilters: any = { ...restFilters };

    if (start_date) {
      newFilters.start_date = decodeURIComponent(start_date);
    }

    if (end_date) {
      newFilters.end_date = decodeURIComponent(end_date);
    }

    if (customer_id) {
      newFilters.textFilters = { conditions: { order: { customer_id: { eq: customer_id } } } };
    }

    try {
      const res = await SupabaseAdapter.find<IOrderPaymentRequest>(supabaseBrowserClient, END_POINT, newFilters, {
        selection: buildSelectionFn({
          relations: {
            order: {
              table: Database.orders,
              nested: {
                customer: {
                  table: Database.users,
                  foreignKey: 'customer_id',
                  columns: ['id', 'name', 'phone', 'email'],
                },
              },
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

  create: async (payload: IOrderPaymentRequestCreate): Promise<IBaseResponse<IOrderPaymentRequest>> => {
    try {
      const res = await SupabaseAdapter.create<IOrderPaymentRequest>(supabaseBrowserClient, END_POINT, payload);
      return Promise.resolve(res);
    } catch (error) {
      throw responseHandlerFn(error);
    }
  },

  quickCreate: async (payload: Omit<IOrderPaymentRequestCreate, 'code'>): Promise<IBaseResponse> => {
    try {
      const res = await AxiosInstance.post(`${END_POINT}/quick`, payload);
      return Promise.resolve(res?.data);
    } catch (error) {
      throw responseHandlerFn(error);
    }
  },

  update: async (payload: {
    id: TId;
    data: Partial<IOrderPaymentRequestCreate>;
  }): Promise<IBaseResponse<IOrderPaymentRequest>> => {
    try {
      const res = await SupabaseAdapter.update<IOrderPaymentRequest>(
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

  delete: async (id: TId): Promise<IBaseResponse<IOrderPaymentRequest>> => {
    try {
      const res = await SupabaseAdapter.delete<IOrderPaymentRequest>(supabaseBrowserClient, END_POINT, id);
      return Promise.resolve(res);
    } catch (error) {
      throw responseHandlerFn(error);
    }
  },
};
