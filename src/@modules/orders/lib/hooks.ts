import { TId } from '@base/interfaces';
import { InfiniteQueryConfig, MutationConfig, queryClient, QueryConfig } from '@lib/config/reactQuery';
import { ProductsServices } from '@modules/products/lib/services';
import { useInfiniteQuery, useMutation, useQuery } from '@tanstack/react-query';
import { IOrdersFilter } from './interfaces';
import { OrdersServices } from './services';

export const OrdersHooks = {
  useFindById: ({ id, config }: { id: TId; config?: QueryConfig<typeof OrdersServices.findById> }) => {
    const { queryKey, ...rest } = config ?? {};

    return useQuery({
      queryKey: [...(queryKey || []), OrdersServices.NAME, id],
      queryFn: () => OrdersServices.findById(id),
      ...rest,
    });
  },

  useQuickFindById: ({ id, config }: { id: TId; config?: QueryConfig<typeof OrdersServices.quickFindById> }) => {
    const { queryKey, ...rest } = config ?? {};

    return useQuery({
      queryKey: [...(queryKey || []), OrdersServices.NAME, id],
      queryFn: () => OrdersServices.quickFindById(id),
      ...rest,
    });
  },

  useFind: ({ options, config }: { options: IOrdersFilter; config?: QueryConfig<typeof OrdersServices.find> }) => {
    const { queryKey, ...rest } = config ?? {};

    return useQuery({
      queryKey: [...(queryKey || []), OrdersServices.NAME, options],
      queryFn: () => OrdersServices.find(options),
      ...rest,
    });
  },

  useQuickFind: ({
    options,
    config,
  }: {
    options: IOrdersFilter;
    config?: QueryConfig<typeof OrdersServices.quickFind>;
  }) => {
    const { queryKey, ...rest } = config ?? {};

    return useQuery({
      queryKey: [...(queryKey || []), OrdersServices.NAME, options],
      queryFn: () => OrdersServices.quickFind(options),
      ...rest,
    });
  },

  useFindInfinite: ({
    options,
    config,
  }: {
    options: IOrdersFilter;
    config?: InfiniteQueryConfig<typeof OrdersServices.find>;
  }) => {
    const { queryKey, ...rest } = config ?? {};

    return useInfiniteQuery({
      queryKey: [...(queryKey || []), OrdersServices.NAME, options],
      queryFn: ({ pageParam }) => OrdersServices.find({ ...options, page: pageParam }),
      initialPageParam: 1,
      getNextPageParam: (lastPage, allPages) => {
        if (!lastPage?.meta) return null;

        const totalFetched = allPages.reduce((count, page) => count + page.data.length, 0);
        return totalFetched < lastPage.meta.total ? lastPage.meta.page + 1 : null;
      },
      ...rest,
    });
  },

  useCreate: ({ config }: { config?: MutationConfig<typeof OrdersServices.create> } = {}) => {
    return useMutation({
      mutationFn: OrdersServices.create,
      onSettled: (data) => {
        if (!data?.success) return;

        queryClient.invalidateQueries({ queryKey: [OrdersServices.NAME] });
        queryClient.invalidateQueries({ queryKey: [ProductsServices.NAME] });
      },
      ...config,
    });
  },

  useQuickCreate: ({ config }: { config?: MutationConfig<typeof OrdersServices.quickCreate> } = {}) => {
    return useMutation({
      mutationFn: OrdersServices.quickCreate,
      onSettled: (data) => {
        if (!data?.success) return;

        queryClient.invalidateQueries({ queryKey: [OrdersServices.NAME] });
        queryClient.invalidateQueries({ queryKey: [ProductsServices.NAME] });
      },
      ...config,
    });
  },

  useUpdate: ({ config }: { config?: MutationConfig<typeof OrdersServices.update> } = {}) => {
    return useMutation({
      mutationFn: OrdersServices.update,
      onSettled: (data) => {
        if (!data?.success) return;

        queryClient.invalidateQueries({ queryKey: [OrdersServices.NAME] });
      },
      ...config,
    });
  },

  useReturn: ({ config }: { config?: MutationConfig<typeof OrdersServices.return> } = {}) => {
    return useMutation({
      mutationFn: OrdersServices.return,
      onSettled: (data) => {
        if (!data?.success) return;

        queryClient.invalidateQueries({ queryKey: [OrdersServices.NAME] });
      },
      ...config,
    });
  },
};
