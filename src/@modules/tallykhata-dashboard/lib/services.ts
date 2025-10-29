import { AxiosSecureInstance } from '@lib/config/axiosInstance';
import { Database } from '@lib/constant/database';
import { responseHandlerFn } from '@lib/utils/errorHandler';
import { Toolbox } from '@lib/utils/toolbox';
import {
  ITallykhataDashboardAnalysesResponse,
  ITallykhataDashboardStatisticsFilter,
  ITallykhataDashboardStatisticsResponse,
} from './interfaces';

const END_POINT: string = `/${Database.tallykhataDashboard}`;

export const TallykhataDashboardServices = {
  NAME: END_POINT,

  findStatistics: async (
    options: ITallykhataDashboardStatisticsFilter,
  ): Promise<ITallykhataDashboardStatisticsResponse> => {
    try {
      const res = await AxiosSecureInstance.get(`${END_POINT}/statistics?${Toolbox.queryNormalizer(options)}`);
      return Promise.resolve(res?.data);
    } catch (error) {
      throw responseHandlerFn(error);
    }
  },

  findAnalyses: async (): Promise<ITallykhataDashboardAnalysesResponse> => {
    try {
      const res = await AxiosSecureInstance.get(`${END_POINT}/analyses`);
      return Promise.resolve(res?.data);
    } catch (error) {
      throw responseHandlerFn(error);
    }
  },
};
