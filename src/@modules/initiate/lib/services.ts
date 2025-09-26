import { IBaseResponse } from '@base/interfaces';
import { AxiosInstance } from '@lib/config/axiosInstance';
import { responseHandlerFn } from '@lib/utils/errorHandler';
import { IInitiateCreate } from './interfaces';

const END_POINT: string = '/initiate';

export const InitiateService = {
  NAME: END_POINT,

  create: async (payload: IInitiateCreate): Promise<IBaseResponse> => {
    try {
      const res = await AxiosInstance.post(END_POINT, payload);
      return Promise.resolve(res?.data);
    } catch (error) {
      throw responseHandlerFn(error);
    }
  },
};
