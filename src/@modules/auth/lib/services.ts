import { IBaseResponse } from '@base/interfaces';
import { AxiosInstance, AxiosSecureInstance } from '@lib/config/axiosInstance';
import { responseHandlerFn } from '@lib/utils/errorHandler';
import { IUser } from '@modules/users/lib/interfaces';
import { ISignIn, ISignInResponse } from './interfaces';

const END_POINT: string = '/auth';

export const AuthServices = {
  NAME: END_POINT,

  profile: async (): Promise<IBaseResponse<IUser>> => {
    try {
      const res = await AxiosSecureInstance.get(`${END_POINT}/profile`);
      return Promise.resolve(res?.data);
    } catch (error) {
      throw responseHandlerFn(error);
    }
  },

  signIn: async (payload: ISignIn): Promise<ISignInResponse> => {
    try {
      const res = await AxiosInstance.post(`${END_POINT}/login`, payload);
      return Promise.resolve(res?.data);
    } catch (error) {
      throw responseHandlerFn(error);
    }
  },

  passwordUpdate: async (payload: { current_password: string; new_password: string }): Promise<IBaseResponse> => {
    try {
      const res = await AxiosSecureInstance.patch(`${END_POINT}/change-password`, payload);
      return Promise.resolve(res?.data);
    } catch (error) {
      throw responseHandlerFn(error);
    }
  },
};
