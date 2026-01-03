import { TId } from '@base/interfaces';
import { AxiosSecureInstance } from '@lib/config/axiosInstance';
import { Database } from '@lib/constant/database';
import { Paths } from '@lib/constant/paths';
import { responseHandlerFn } from '@lib/utils/errorHandler';
import { AxiosRequestConfig } from 'axios';
import { ISettingsCreate, ISettingsResponse } from './interfaces';

const END_POINT: string = `/${Database.settings}`;

export const SettingsServices = {
  NAME: END_POINT,

  find: async (config?: AxiosRequestConfig): Promise<ISettingsResponse> => {
    try {
      const res = await AxiosSecureInstance.get(END_POINT, config);
      return Promise.resolve(res?.data);
    } catch (error) {
      throw responseHandlerFn(error);
    }
  },

  update: async (payload: { id: TId; data: Partial<ISettingsCreate> }): Promise<ISettingsResponse> => {
    try {
      const res = await AxiosSecureInstance.patch(`${END_POINT}/${payload.id}`, payload.data);

      await AxiosSecureInstance.post('/revalidate', {
        route: Paths.root,
      });

      return Promise.resolve(res?.data);
    } catch (error) {
      throw responseHandlerFn(error);
    }
  },
};
