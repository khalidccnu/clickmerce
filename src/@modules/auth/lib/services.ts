import { IBaseResponse } from '@base/interfaces';
import { AxiosInstance, AxiosSecureInstance } from '@lib/config/axiosInstance';
import { responseHandlerFn } from '@lib/utils/errorHandler';
import { IUser, IUserCreate } from '@modules/users/lib/interfaces';
import { ILogin, ILoginResponse } from './interfaces';

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

  login: async (payload: ILogin): Promise<ILoginResponse> => {
    try {
      const res = await AxiosInstance.post(`${END_POINT}/login`, payload);
      return Promise.resolve(res?.data);
    } catch (error) {
      throw responseHandlerFn(error);
    }
  },

  register: async (payload: IUserCreate): Promise<IBaseResponse<{ phone: string; hash: string; otp: number }>> => {
    try {
      const res = await AxiosInstance.post(`${END_POINT}/register`, payload);
      return Promise.resolve(res?.data);
    } catch (error) {
      throw responseHandlerFn(error);
    }
  },

  passwordResetRequest: async (payload: {
    phone: string;
  }): Promise<
    IBaseResponse<{
      phone: string;
      hash: string;
      otp: number;
    }>
  > => {
    try {
      const res = await AxiosInstance.post(`${END_POINT}/reset-password-request`, payload);
      return Promise.resolve(res?.data);
    } catch (error) {
      throw responseHandlerFn(error);
    }
  },

  passwordReset: async (payload: {
    phone: string;
    hash: string;
    otp: number;
    new_password: string;
  }): Promise<IBaseResponse> => {
    try {
      const res = await AxiosInstance.patch(`${END_POINT}/reset-password`, payload);
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

  profileVerifyRequest: async (payload: { phone: string }): Promise<IBaseResponse> => {
    try {
      const res = await AxiosSecureInstance.post(`${END_POINT}/verify-profile-request`, payload);
      return Promise.resolve(res?.data);
    } catch (error) {
      throw responseHandlerFn(error);
    }
  },

  profileVerify: async (payload: { phone: string; hash: string; otp: number }): Promise<IBaseResponse> => {
    try {
      const res = await AxiosSecureInstance.patch(`${END_POINT}/verify-profile`, payload);
      return Promise.resolve(res?.data);
    } catch (error) {
      throw responseHandlerFn(error);
    }
  },
};
