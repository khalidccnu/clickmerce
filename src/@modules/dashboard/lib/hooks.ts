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
      queryKey: [...(queryKey || []), 'statistics', DashboardServices.NAME, options],
      queryFn: () => DashboardServices.findStatistics(options),
      ...rest,
    });
  },

  useFindQuickStatistic: ({ config }: { config?: QueryConfig<typeof DashboardServices.findQuickStatistics> } = {}) => {
    const { queryKey, ...rest } = config ?? {};

    return useQuery({
      queryKey: [...(queryKey || []), 'quick-statistics', DashboardServices.NAME],
      queryFn: DashboardServices.findQuickStatistics,
      ...rest,
    });
  },

  useFindAnalyses: ({ config }: { config?: QueryConfig<typeof DashboardServices.findAnalyses> } = {}) => {
    const { queryKey, ...rest } = config ?? {};

    return useQuery({
      queryKey: [...(queryKey || []), 'analyses', DashboardServices.NAME],
      queryFn: DashboardServices.findAnalyses,
      ...rest,
    });
  },
};
