import { TId } from '@base/interfaces';
import { InfiniteQueryConfig, MutationConfig, queryClient, QueryConfig } from '@lib/config/reactQuery';
import { useInfiniteQuery, useMutation, useQuery } from '@tanstack/react-query';
import { ITransactionsFilter } from './interfaces';
import { TransactionsServices } from './services';

export const TransactionsHooks = {
  useFindById: ({ id, config }: { id: TId; config?: QueryConfig<typeof TransactionsServices.findById> }) => {
    const { queryKey, ...rest } = config ?? {};

    return useQuery({
      queryKey: [...(queryKey || []), TransactionsServices.NAME, id],
      queryFn: () => TransactionsServices.findById(id),
      ...rest,
    });
  },

  useFind: ({
    options,
    config,
  }: {
    options: ITransactionsFilter;
    config?: QueryConfig<typeof TransactionsServices.find>;
  }) => {
    const { queryKey, ...rest } = config ?? {};

    return useQuery({
      queryKey: [...(queryKey || []), TransactionsServices.NAME, options],
      queryFn: () => TransactionsServices.find(options),
      ...rest,
    });
  },

  useFindInfinite: ({
    options,
    config,
  }: {
    options: ITransactionsFilter;
    config?: InfiniteQueryConfig<typeof TransactionsServices.find>;
  }) => {
    const { queryKey, ...rest } = config ?? {};

    return useInfiniteQuery({
      queryKey: [...(queryKey || []), TransactionsServices.NAME, options],
      queryFn: ({ pageParam }) => TransactionsServices.find({ ...options, page: pageParam }),
      initialPageParam: 1,
      getNextPageParam: (lastPage, allPages) => {
        if (!lastPage?.meta) return null;

        const totalFetched = allPages.reduce((count, page) => count + page.data.length, 0);
        return totalFetched < lastPage.meta.total ? lastPage.meta.page + 1 : null;
      },
      ...rest,
    });
  },

  useCreate: ({ config }: { config?: MutationConfig<typeof TransactionsServices.create> } = {}) => {
    return useMutation({
      mutationFn: TransactionsServices.create,
      onSettled: (data) => {
        if (!data?.success) return;

        queryClient.invalidateQueries({ queryKey: [TransactionsServices.NAME] });
      },
      ...config,
    });
  },

  // useUpdate: ({ config }: { config?: MutationConfig<typeof TransactionsServices.update> } = {}) => {
  //   return useMutation({
  //     mutationFn: TransactionsServices.update,
  //     onSettled: (data) => {
  //       if (!data?.success) return;

  //       queryClient.invalidateQueries({ queryKey: [TransactionsServices.NAME] });
  //     },
  //     ...config,
  //   });
  // },

  // useDelete: ({ config }: { config?: MutationConfig<typeof TransactionsServices.delete> } = {}) => {
  //   return useMutation({
  //     mutationFn: TransactionsServices.delete,
  //     onSettled: (data) => {
  //       if (!data?.success) return;

  //       queryClient.invalidateQueries({ queryKey: [TransactionsServices.NAME] });
  //     },
  //     ...config,
  //   });
  // },
};
