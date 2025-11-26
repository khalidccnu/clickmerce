import { TId } from '@base/interfaces';
import { InfiniteQueryConfig, MutationConfig, queryClient, QueryConfig } from '@lib/config/reactQuery';
import { useInfiniteQuery, useMutation, useQuery } from '@tanstack/react-query';
import { IPopupsFilter } from './interfaces';
import { PopupsServices } from './services';

export const PopupsHooks = {
  useFindById: ({ id, config }: { id: TId; config?: QueryConfig<typeof PopupsServices.findById> }) => {
    const { queryKey, ...rest } = config ?? {};

    return useQuery({
      queryKey: [...(queryKey || []), PopupsServices.NAME, id],
      queryFn: () => PopupsServices.findById(id),
      ...rest,
    });
  },

  useFind: ({ options, config }: { options: IPopupsFilter; config?: QueryConfig<typeof PopupsServices.find> }) => {
    const { queryKey, ...rest } = config ?? {};

    return useQuery({
      queryKey: [...(queryKey || []), PopupsServices.NAME, options],
      queryFn: () => PopupsServices.find(options),
      ...rest,
    });
  },

  useFindInfinite: ({
    options,
    config,
  }: {
    options: IPopupsFilter;
    config?: InfiniteQueryConfig<typeof PopupsServices.find>;
  }) => {
    const { queryKey, ...rest } = config ?? {};

    return useInfiniteQuery({
      queryKey: [...(queryKey || []), PopupsServices.NAME, options],
      queryFn: ({ pageParam }) => PopupsServices.find({ ...options, page: pageParam }),
      initialPageParam: 1,
      getNextPageParam: (lastPage, allPages) => {
        if (!lastPage?.meta) return null;

        const totalFetched = allPages.reduce((count, page) => count + page.data.length, 0);
        return totalFetched < lastPage.meta.total ? lastPage.meta.page + 1 : null;
      },
      ...rest,
    });
  },

  useCreate: ({ config }: { config?: MutationConfig<typeof PopupsServices.create> } = {}) => {
    return useMutation({
      mutationFn: PopupsServices.create,
      onSettled: (data) => {
        if (!data?.success) return;

        queryClient.invalidateQueries({ queryKey: [PopupsServices.NAME] });
      },
      ...config,
    });
  },

  useUpdate: ({ config }: { config?: MutationConfig<typeof PopupsServices.update> } = {}) => {
    return useMutation({
      mutationFn: PopupsServices.update,
      onSettled: (data) => {
        if (!data?.success) return;

        queryClient.invalidateQueries({ queryKey: [PopupsServices.NAME] });
      },
      ...config,
    });
  },

  useDelete: ({ config }: { config?: MutationConfig<typeof PopupsServices.delete> } = {}) => {
    return useMutation({
      mutationFn: PopupsServices.delete,
      onSettled: (data) => {
        if (!data?.success) return;

        queryClient.invalidateQueries({ queryKey: [PopupsServices.NAME] });
      },
      ...config,
    });
  },
};
