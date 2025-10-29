import { QueryConfig } from '@lib/config/reactQuery';
import { useQuery } from '@tanstack/react-query';
import { ITallykhataDashboardStatisticsFilter } from './interfaces';
import { TallykhataDashboardServices } from './services';

export const TallykhataDashboardHooks = {
  useFindStatistic: ({
    options,
    config,
  }: {
    options: ITallykhataDashboardStatisticsFilter;
    config?: QueryConfig<typeof TallykhataDashboardServices.findStatistics>;
  }) => {
    const { queryKey, ...rest } = config ?? {};

    return useQuery({
      queryKey: [...(queryKey || []), TallykhataDashboardServices.NAME, options],
      queryFn: () => TallykhataDashboardServices.findStatistics(options),
      ...rest,
    });
  },

  useFindAnalyses: ({ config }: { config?: QueryConfig<typeof TallykhataDashboardServices.findAnalyses> } = {}) => {
    const { queryKey, ...rest } = config ?? {};

    return useQuery({
      queryKey: [...(queryKey || []), TallykhataDashboardServices.NAME],
      queryFn: TallykhataDashboardServices.findAnalyses,
      ...rest,
    });
  },
};
