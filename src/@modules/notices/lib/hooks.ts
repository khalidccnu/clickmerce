import { TId } from '@base/interfaces';
import { InfiniteQueryConfig, MutationConfig, queryClient, QueryConfig } from '@lib/config/reactQuery';
import { useInfiniteQuery, useMutation, useQuery } from '@tanstack/react-query';
import { INoticesFilter } from './interfaces';
import { NoticesServices } from './services';

export const NoticesHooks = {
  useFindById: ({ id, config }: { id: TId; config?: QueryConfig<typeof NoticesServices.findById> }) => {
    const { queryKey, ...rest } = config ?? {};

    return useQuery({
      queryKey: [...(queryKey || []), NoticesServices.NAME, id],
      queryFn: () => NoticesServices.findById(id),
      ...rest,
    });
  },

  useFind: ({ options, config }: { options: INoticesFilter; config?: QueryConfig<typeof NoticesServices.find> }) => {
    const { queryKey, ...rest } = config ?? {};

    return useQuery({
      queryKey: [...(queryKey || []), NoticesServices.NAME, options],
      queryFn: () => NoticesServices.find(options),
      ...rest,
    });
  },

  useFindInfinite: ({
    options,
    config,
  }: {
    options: INoticesFilter;
    config?: InfiniteQueryConfig<typeof NoticesServices.find>;
  }) => {
    const { queryKey, ...rest } = config ?? {};

    return useInfiniteQuery({
      queryKey: [...(queryKey || []), NoticesServices.NAME, options],
      queryFn: ({ pageParam }) => NoticesServices.find({ ...options, page: pageParam }),
      initialPageParam: 1,
      getNextPageParam: (lastPage, allPages) => {
        if (!lastPage?.meta) return null;

        const totalFetched = allPages.reduce((count, page) => count + page.data.length, 0);
        return totalFetched < lastPage.meta.total ? lastPage.meta.page + 1 : null;
      },
      ...rest,
    });
  },

  useCreate: ({ config }: { config?: MutationConfig<typeof NoticesServices.create> } = {}) => {
    return useMutation({
      mutationFn: NoticesServices.create,
      onSettled: (data) => {
        if (!data?.success) return;

        queryClient.invalidateQueries({ queryKey: [NoticesServices.NAME] });
      },
      ...config,
    });
  },

  useUpdate: ({ config }: { config?: MutationConfig<typeof NoticesServices.update> } = {}) => {
    return useMutation({
      mutationFn: NoticesServices.update,
      onSettled: (data) => {
        if (!data?.success) return;

        queryClient.invalidateQueries({ queryKey: [NoticesServices.NAME] });
      },
      ...config,
    });
  },

  useDelete: ({ config }: { config?: MutationConfig<typeof NoticesServices.delete> } = {}) => {
    return useMutation({
      mutationFn: NoticesServices.delete,
      onSettled: (data) => {
        if (!data?.success) return;

        queryClient.invalidateQueries({ queryKey: [NoticesServices.NAME] });
      },
      ...config,
    });
  },
};
