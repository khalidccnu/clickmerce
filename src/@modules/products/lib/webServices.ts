import { IBaseResponse, TId } from '@base/interfaces';
import { AxiosInstance } from '@lib/config/axiosInstance';
import { Database } from '@lib/constant/database';
import { responseHandlerFn } from '@lib/utils/errorHandler';
import { Toolbox } from '@lib/utils/toolbox';
import { IProduct, IProductsFilter, IProductsResponse } from './interfaces';

const END_POINT: string = `/${Database.products}`;

export const ProductsWebServices = {
  NAME: END_POINT,

  findBySlug: async (slug: TId): Promise<IBaseResponse<IProduct>> => {
    try {
      const res = await AxiosInstance.get(`${END_POINT}/by-slug/${slug}`);
      return Promise.resolve(res?.data);
    } catch (error) {
      throw responseHandlerFn(error);
    }
  },

  find: async (filters: IProductsFilter): Promise<IProductsResponse> => {
    try {
      const res = await AxiosInstance.get(`${END_POINT}?${Toolbox.queryNormalizer(filters)}`);
      return Promise.resolve(res?.data);
    } catch (error) {
      throw responseHandlerFn(error);
    }
  },
};
