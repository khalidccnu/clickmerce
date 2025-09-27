import { TId } from '@base/interfaces';
import { InfiniteQueryConfig, MutationConfig, queryClient, QueryConfig } from '@lib/config/reactQuery';
import { useInfiniteQuery, useMutation, useQuery } from '@tanstack/react-query';
import { IDeliveryZonesFilter } from './interfaces';
import { DeliveryZonesServices } from './services';

export const DeliveryZonesHooks = {
  useFindById: ({ id, config }: { id: TId; config?: QueryConfig<typeof DeliveryZonesServices.findById> }) => {
    const { queryKey, ...rest } = config ?? {};

    return useQuery({
      queryKey: [...(queryKey || []), DeliveryZonesServices.NAME, id],
      queryFn: () => DeliveryZonesServices.findById(id),
      ...rest,
    });
  },

  useFind: ({
    options,
    config,
  }: {
    options: IDeliveryZonesFilter;
    config?: QueryConfig<typeof DeliveryZonesServices.find>;
  }) => {
    const { queryKey, ...rest } = config ?? {};

    return useQuery({
      queryKey: [...(queryKey || []), DeliveryZonesServices.NAME, options],
      queryFn: () => DeliveryZonesServices.find(options),
      ...rest,
    });
  },

  useFindInfinite: ({
    options,
    config,
  }: {
    options: IDeliveryZonesFilter;
    config?: InfiniteQueryConfig<typeof DeliveryZonesServices.find>;
  }) => {
    const { queryKey, ...rest } = config ?? {};

    return useInfiniteQuery({
      queryKey: [...(queryKey || []), DeliveryZonesServices.NAME, options],
      queryFn: ({ pageParam }) => DeliveryZonesServices.find({ ...options, page: pageParam }),
      initialPageParam: 1,
      getNextPageParam: (lastPage, allPages) => {
        if (!lastPage?.meta) return null;

        const totalFetched = allPages.reduce((count, page) => count + page.data.length, 0);
        return totalFetched < lastPage.meta.total ? lastPage.meta.page + 1 : null;
      },
      ...rest,
    });
  },

  useCreate: ({ config }: { config?: MutationConfig<typeof DeliveryZonesServices.create> } = {}) => {
    return useMutation({
      mutationFn: DeliveryZonesServices.create,
      onSettled: (data) => {
        if (!data?.success) return;

        queryClient.invalidateQueries({ queryKey: [DeliveryZonesServices.NAME] });
      },
      ...config,
    });
  },

  useUpdate: ({ config }: { config?: MutationConfig<typeof DeliveryZonesServices.update> } = {}) => {
    return useMutation({
      mutationFn: DeliveryZonesServices.update,
      onSettled: (data) => {
        if (!data?.success) return;

        queryClient.invalidateQueries({ queryKey: [DeliveryZonesServices.NAME] });
      },
      ...config,
    });
  },
};
