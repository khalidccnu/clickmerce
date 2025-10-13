import { IBaseResponse, TId } from '@base/interfaces';
import { AxiosSecureInstance } from '@lib/config/axiosInstance';
import { Database } from '@lib/constant/database';
import { responseHandlerFn } from '@lib/utils/errorHandler';
import { Toolbox } from '@lib/utils/toolbox';
import { IOrderReturn, IOrderReturnCreate, IOrderReturnsFilter, IOrderReturnsResponse } from './interfaces';

const END_POINT: string = `/${Database.orderReturns}`;

export const OrderReturnsServices = {
  NAME: END_POINT,

  findById: async (id: TId): Promise<IBaseResponse<IOrderReturn>> => {
    try {
      const res = await AxiosSecureInstance.get(`${END_POINT}/${id}`);
      return Promise.resolve(res?.data);
    } catch (error) {
      throw responseHandlerFn(error);
    }
  },

  find: async (filters: IOrderReturnsFilter): Promise<IOrderReturnsResponse> => {
    try {
      const res = await AxiosSecureInstance.get(`${END_POINT}?${Toolbox.queryNormalizer(filters)}`);
      return Promise.resolve(res?.data);
    } catch (error) {
      throw responseHandlerFn(error);
    }
  },

  create: async (payload: IOrderReturnCreate): Promise<IBaseResponse<IOrderReturn>> => {
    try {
      const res = await AxiosSecureInstance.post(END_POINT, payload);
      return Promise.resolve(res?.data);
    } catch (error) {
      throw responseHandlerFn(error);
    }
  },

  update: async (payload: { id: TId; data: Partial<IOrderReturnCreate> }): Promise<IBaseResponse<IOrderReturn>> => {
    try {
      const res = await AxiosSecureInstance.patch(`${END_POINT}/${payload.id}`, payload.data);
      return Promise.resolve(res?.data);
    } catch (error) {
      throw responseHandlerFn(error);
    }
  },
};
