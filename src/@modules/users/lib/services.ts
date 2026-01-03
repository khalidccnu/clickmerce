import { IBaseResponse, TId } from '@base/interfaces';
import { AxiosSecureInstance } from '@lib/config/axiosInstance';
import { Database } from '@lib/constant/database';
import { responseHandlerFn } from '@lib/utils/errorHandler';
import { Toolbox } from '@lib/utils/toolbox';
import { IUser, IUserCourierHealth, IUserCreate, IUsersFilter, IUsersResponse } from './interfaces';

const END_POINT: string = `/${Database.users}`;

export const UsersServices = {
  NAME: END_POINT,

  findById: async (id: TId): Promise<IBaseResponse<IUser>> => {
    try {
      const res = await AxiosSecureInstance.get(`${END_POINT}/${id}`);
      return Promise.resolve(res?.data);
    } catch (error) {
      throw responseHandlerFn(error);
    }
  },

  find: async (filters: IUsersFilter): Promise<IUsersResponse> => {
    try {
      const res = await AxiosSecureInstance.get(`${END_POINT}?${Toolbox.queryNormalizer(filters)}`);
      return Promise.resolve(res?.data);
    } catch (error) {
      throw responseHandlerFn(error);
    }
  },

  create: async (payload: IUserCreate): Promise<IBaseResponse<IUser>> => {
    try {
      const res = await AxiosSecureInstance.post(END_POINT, Toolbox.toNullifyTraverse(payload));
      return Promise.resolve(res?.data);
    } catch (error) {
      throw responseHandlerFn(error);
    }
  },

  update: async (payload: { id: TId; data: Partial<IUserCreate> }): Promise<IBaseResponse<IUser>> => {
    try {
      const res = await AxiosSecureInstance.patch(`${END_POINT}/${payload.id}`, payload.data);
      return Promise.resolve(res?.data);
    } catch (error) {
      throw responseHandlerFn(error);
    }
  },

  findCourierHealth: async (phone: string): Promise<IBaseResponse<IUserCourierHealth>> => {
    try {
      const res = await AxiosSecureInstance.post(`${END_POINT}/courier-health`, { phone });
      return Promise.resolve(res?.data);
    } catch (error) {
      throw responseHandlerFn(error);
    }
  },
};
