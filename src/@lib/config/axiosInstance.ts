import { Env } from '.environments';
import { IBaseResponse } from '@base/interfaces';
import { getNotificationInstance } from '@lib/utils/notificationInstance';
import { AuthHooks } from '@modules/auth/lib/hooks';
import { getAuthToken } from '@modules/auth/lib/utils/client';
import { getServerAuthToken } from '@modules/auth/lib/utils/server';
import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

const isClient = typeof window !== 'undefined';

// Axios Instance
export const AxiosInstance = axios.create({
  baseURL: isClient ? Env.apiUrl : Env.webHostUrl + Env.apiUrl,
  headers: {
    'Time-Zone-Offset': -new Date().getTimezoneOffset(),
  },
});

AxiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => config,
  (error: AxiosError) => Promise.reject(error),
);

AxiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError<IBaseResponse>) => {
    if (isClient) {
      const notification = getNotificationInstance();

      if (error.config?.method === 'get') {
        notification.error({
          message: error.response?.data?.message || error.response?.statusText || error.message,
        });
      }
    }

    return error.response;
  },
);

// Axios Instance (Secure)
export const AxiosSecureInstance = axios.create({
  ...AxiosInstance.defaults,
  headers: {
    ...AxiosInstance.defaults.headers,
    // Authorization: `Bearer ${getAuthToken()}`,
  },
});

AxiosSecureInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    let token: string = null;
    const { req } = config;

    if (isClient) {
      token = getAuthToken();
    } else if (req) {
      config.headers['cookie'] = req.headers.cookie || '';
      token = getServerAuthToken(req);
      delete config.req;
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

AxiosSecureInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError<IBaseResponse>) => {
    if (isClient) {
      const notification = getNotificationInstance();

      if ([401, 403].includes(error.response?.status)) {
        notification.error({
          message: error.response?.data?.message || error.response?.statusText || error.message,
        });
        AuthHooks.useSignOut();
      } else if (error.config?.method === 'get') {
        notification.error({
          message: error.response?.data?.message || error.response?.statusText || error.message,
        });
      }
    }

    return error.response;
  },
);
