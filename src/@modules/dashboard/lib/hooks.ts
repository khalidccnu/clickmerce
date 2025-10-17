import { QueryConfig } from '@lib/config/reactQuery';
import { useQuery } from '@tanstack/react-query';
import { IDashboardStatisticsFilter } from './interfaces';
import { DashboardServices } from './services';

export const DashboardHooks = {
  useFindStatistic: ({
    options,
    config,
  }: {
    options: IDashboardStatisticsFilter;
    config?: QueryConfig<typeof DashboardServices.findStatistics>;
  }) => {
    const { queryKey, ...rest } = config ?? {};

    return useQuery({
      queryKey: [...(queryKey || []), DashboardServices.NAME, options],
      queryFn: () => DashboardServices.findStatistics(options),
      ...rest,
    });
  },

  useFindAnalyses: ({ config }: { config?: QueryConfig<typeof DashboardServices.findAnalyses> } = {}) => {
    const { queryKey, ...rest } = config ?? {};

    return useQuery({
      queryKey: [...(queryKey || []), DashboardServices.NAME],
      queryFn: DashboardServices.findAnalyses,
      ...rest,
    });
  },
};
