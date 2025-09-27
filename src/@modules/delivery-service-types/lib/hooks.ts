import { TId } from '@base/interfaces';
import { InfiniteQueryConfig, MutationConfig, queryClient, QueryConfig } from '@lib/config/reactQuery';
import { useInfiniteQuery, useMutation, useQuery } from '@tanstack/react-query';
import { IDeliveryServiceTypesFilter } from './interfaces';
import { DeliveryServiceTypesServices } from './services';

export const DeliveryServiceTypesHooks = {
  useFindById: ({ id, config }: { id: TId; config?: QueryConfig<typeof DeliveryServiceTypesServices.findById> }) => {
    const { queryKey, ...rest } = config ?? {};

    return useQuery({
      queryKey: [...(queryKey || []), DeliveryServiceTypesServices.NAME, id],
      queryFn: () => DeliveryServiceTypesServices.findById(id),
      ...rest,
    });
  },

  useFind: ({
    options,
    config,
  }: {
    options: IDeliveryServiceTypesFilter;
    config?: QueryConfig<typeof DeliveryServiceTypesServices.find>;
  }) => {
    const { queryKey, ...rest } = config ?? {};

    return useQuery({
      queryKey: [...(queryKey || []), DeliveryServiceTypesServices.NAME, options],
      queryFn: () => DeliveryServiceTypesServices.find(options),
      ...rest,
    });
  },

  useFindInfinite: ({
    options,
    config,
  }: {
    options: IDeliveryServiceTypesFilter;
    config?: InfiniteQueryConfig<typeof DeliveryServiceTypesServices.find>;
  }) => {
    const { queryKey, ...rest } = config ?? {};

    return useInfiniteQuery({
      queryKey: [...(queryKey || []), DeliveryServiceTypesServices.NAME, options],
      queryFn: ({ pageParam }) => DeliveryServiceTypesServices.find({ ...options, page: pageParam }),
      initialPageParam: 1,
      getNextPageParam: (lastPage, allPages) => {
        if (!lastPage?.meta) return null;

        const totalFetched = allPages.reduce((count, page) => count + page.data.length, 0);
        return totalFetched < lastPage.meta.total ? lastPage.meta.page + 1 : null;
      },
      ...rest,
    });
  },

  useCreate: ({ config }: { config?: MutationConfig<typeof DeliveryServiceTypesServices.create> } = {}) => {
    return useMutation({
      mutationFn: DeliveryServiceTypesServices.create,
      onSettled: (data) => {
        if (!data?.success) return;

        queryClient.invalidateQueries({ queryKey: [DeliveryServiceTypesServices.NAME] });
      },
      ...config,
    });
  },

  useUpdate: ({ config }: { config?: MutationConfig<typeof DeliveryServiceTypesServices.update> } = {}) => {
    return useMutation({
      mutationFn: DeliveryServiceTypesServices.update,
      onSettled: (data) => {
        if (!data?.success) return;

        queryClient.invalidateQueries({ queryKey: [DeliveryServiceTypesServices.NAME] });
      },
      ...config,
    });
  },
};
