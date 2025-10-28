import { TId } from '@base/interfaces';
import { InfiniteQueryConfig, MutationConfig, queryClient, QueryConfig } from '@lib/config/reactQuery';
import { useInfiniteQuery, useMutation, useQuery } from '@tanstack/react-query';
import { IBannersFilter } from './interfaces';
import { BannersServices } from './services';

export const BannersHooks = {
  useFindById: ({ id, config }: { id: TId; config?: QueryConfig<typeof BannersServices.findById> }) => {
    const { queryKey, ...rest } = config ?? {};

    return useQuery({
      queryKey: [...(queryKey || []), BannersServices.NAME, id],
      queryFn: () => BannersServices.findById(id),
      ...rest,
    });
  },

  useFind: ({ options, config }: { options: IBannersFilter; config?: QueryConfig<typeof BannersServices.find> }) => {
    const { queryKey, ...rest } = config ?? {};

    return useQuery({
      queryKey: [...(queryKey || []), BannersServices.NAME, options],
      queryFn: () => BannersServices.find(options),
      ...rest,
    });
  },

  useFindInfinite: ({
    options,
    config,
  }: {
    options: IBannersFilter;
    config?: InfiniteQueryConfig<typeof BannersServices.find>;
  }) => {
    const { queryKey, ...rest } = config ?? {};

    return useInfiniteQuery({
      queryKey: [...(queryKey || []), BannersServices.NAME, options],
      queryFn: ({ pageParam }) => BannersServices.find({ ...options, page: pageParam }),
      initialPageParam: 1,
      getNextPageParam: (lastPage, allPages) => {
        if (!lastPage?.meta) return null;

        const totalFetched = allPages.reduce((count, page) => count + page.data.length, 0);
        return totalFetched < lastPage.meta.total ? lastPage.meta.page + 1 : null;
      },
      ...rest,
    });
  },

  useCreate: ({ config }: { config?: MutationConfig<typeof BannersServices.create> } = {}) => {
    return useMutation({
      mutationFn: BannersServices.create,
      onSettled: (data) => {
        if (!data?.success) return;

        queryClient.invalidateQueries({ queryKey: [BannersServices.NAME] });
      },
      ...config,
    });
  },

  useUpdate: ({ config }: { config?: MutationConfig<typeof BannersServices.update> } = {}) => {
    return useMutation({
      mutationFn: BannersServices.update,
      onSettled: (data) => {
        if (!data?.success) return;

        queryClient.invalidateQueries({ queryKey: [BannersServices.NAME] });
      },
      ...config,
    });
  },

  useDelete: ({ config }: { config?: MutationConfig<typeof BannersServices.delete> } = {}) => {
    return useMutation({
      mutationFn: BannersServices.delete,
      onSettled: (data) => {
        if (!data?.success) return;

        queryClient.invalidateQueries({ queryKey: [BannersServices.NAME] });
      },
      ...config,
    });
  },
};
