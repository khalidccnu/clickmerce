import { TId } from '@base/interfaces';
import { AxiosSecureInstance } from '@lib/config/axiosInstance';
import { responseHandlerFn } from '@lib/utils/errorHandler';
import { ISettingsCreate, ISettingsResponse } from './interfaces';

const END_POINT: string = '/settings';

export const SettingsServices = {
  NAME: END_POINT,

  find: async (): Promise<ISettingsResponse> => {
    try {
      const res = await AxiosSecureInstance.get(END_POINT);
      return Promise.resolve(res?.data);
    } catch (error) {
      throw responseHandlerFn(error);
    }
  },

  update: async (payload: { id: TId; data: Partial<ISettingsCreate> }): Promise<ISettingsResponse> => {
    try {
      const res = await AxiosSecureInstance.patch(`${END_POINT}/${payload.id}`, payload.data);
      return Promise.resolve(res?.data);
    } catch (error) {
      throw responseHandlerFn(error);
    }
  },
};
