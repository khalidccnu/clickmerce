import { IBaseResponse, TId } from '@base/interfaces';
import { AxiosSecureInstance } from '@lib/config/axiosInstance';
import { Database } from '@lib/constant/database';
import { responseHandlerFn } from '@lib/utils/errorHandler';
import { Toolbox } from '@lib/utils/toolbox';
import {
  IOrder,
  IOrderCreate,
  IOrderQuickCreate,
  IOrderReturnUpdate,
  IOrdersFilter,
  IOrdersResponse,
} from './interfaces';

const END_POINT: string = `/${Database.orders}`;

export const OrdersServices = {
  NAME: END_POINT,

  findById: async (id: TId): Promise<IBaseResponse<IOrder>> => {
    try {
      const res = await AxiosSecureInstance.get(`${END_POINT}/${id}`);
      return Promise.resolve(res?.data);
    } catch (error) {
      throw responseHandlerFn(error);
    }
  },

  quickFindById: async (id: TId): Promise<IBaseResponse<IOrder>> => {
    try {
      const res = await AxiosSecureInstance.get(`${END_POINT}/quick/${id}`);
      return Promise.resolve(res?.data);
    } catch (error) {
      throw responseHandlerFn(error);
    }
  },

  find: async (filters: IOrdersFilter): Promise<IOrdersResponse> => {
    try {
      const res = await AxiosSecureInstance.get(`${END_POINT}?${Toolbox.queryNormalizer(filters)}`);
      return Promise.resolve(res?.data);
    } catch (error) {
      throw responseHandlerFn(error);
    }
  },

  create: async (payload: IOrderCreate): Promise<IBaseResponse<IOrder>> => {
    try {
      const res = await AxiosSecureInstance.post(END_POINT, payload);
      return Promise.resolve(res?.data);
    } catch (error) {
      throw responseHandlerFn(error);
    }
  },

  quickCreate: async (payload: IOrderQuickCreate): Promise<IBaseResponse<IOrder>> => {
    try {
      const res = await AxiosSecureInstance.post(`${END_POINT}/quick`, Toolbox.toNullifyTraverse(payload));
      return Promise.resolve(res?.data);
    } catch (error) {
      throw responseHandlerFn(error);
    }
  },

  update: async (payload: {
    id: TId;
    data: Partial<IOrderCreate & { payment_reference: string }>;
  }): Promise<IBaseResponse<IOrder>> => {
    try {
      const res = await AxiosSecureInstance.patch(`${END_POINT}/${payload.id}`, payload.data);
      return Promise.resolve(res?.data);
    } catch (error) {
      throw responseHandlerFn(error);
    }
  },

  return: async (payload: { id: TId; data: IOrderReturnUpdate }): Promise<IBaseResponse<IOrder>> => {
    try {
      const res = await AxiosSecureInstance.post(`${END_POINT}/${payload.id}`, payload.data);
      return Promise.resolve(res?.data);
    } catch (error) {
      throw responseHandlerFn(error);
    }
  },
};
