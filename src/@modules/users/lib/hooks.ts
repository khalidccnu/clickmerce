import { TId } from '@base/interfaces';
import { InfiniteQueryConfig, MutationConfig, queryClient, QueryConfig } from '@lib/config/reactQuery';
import { useInfiniteQuery, useMutation, useQuery } from '@tanstack/react-query';
import { IUsersFilter } from './interfaces';
import { UsersServices } from './services';

export const UsersHooks = {
  useFindById: ({ id, config }: { id: TId; config?: QueryConfig<typeof UsersServices.findById> }) => {
    const { queryKey, ...rest } = config ?? {};

    return useQuery({
      queryKey: [...(queryKey || []), UsersServices.NAME, id],
      queryFn: () => UsersServices.findById(id),
      ...rest,
    });
  },

  useFind: ({ options, config }: { options: IUsersFilter; config?: QueryConfig<typeof UsersServices.find> }) => {
    const { queryKey, ...rest } = config ?? {};

    return useQuery({
      queryKey: [...(queryKey || []), UsersServices.NAME, options],
      queryFn: () => UsersServices.find(options),
      ...rest,
    });
  },

  useFindInfinite: ({
    options,
    config,
  }: {
    options: IUsersFilter;
    config?: InfiniteQueryConfig<typeof UsersServices.find>;
  }) => {
    const { queryKey, ...rest } = config ?? {};

    return useInfiniteQuery({
      queryKey: [...(queryKey || []), UsersServices.NAME, options],
      queryFn: ({ pageParam }) => UsersServices.find({ ...options, page: pageParam }),
      initialPageParam: 1,
      getNextPageParam: (lastPage, allPages) => {
        if (!lastPage?.meta) return null;

        const totalFetched = allPages.reduce((count, page) => count + page.data.length, 0);
        return totalFetched < lastPage.meta.total ? lastPage.meta.page + 1 : null;
      },
      ...rest,
    });
  },

  useCreate: ({ config }: { config?: MutationConfig<typeof UsersServices.create> } = {}) => {
    return useMutation({
      mutationFn: UsersServices.create,
      onSettled: (data) => {
        if (!data?.success) return;

        queryClient.invalidateQueries({ queryKey: [UsersServices.NAME] });
      },
      ...config,
    });
  },

  useUpdate: ({ config }: { config?: MutationConfig<typeof UsersServices.update> } = {}) => {
    return useMutation({
      mutationFn: UsersServices.update,
      onSettled: (data) => {
        if (!data?.success) return;

        queryClient.invalidateQueries({ queryKey: [UsersServices.NAME] });
      },
      ...config,
    });
  },
};
