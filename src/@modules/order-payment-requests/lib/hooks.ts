import { TId } from '@base/interfaces';
import { InfiniteQueryConfig, MutationConfig, queryClient, QueryConfig } from '@lib/config/reactQuery';
import { ProductsServices } from '@modules/products/lib/services';
import { useInfiniteQuery, useMutation, useQuery } from '@tanstack/react-query';
import { IOrderPaymentRequestsFilter } from './interfaces';
import { OrderPaymentRequestsServices } from './services';

export const OrderPaymentRequestsHooks = {
  useFindById: ({ id, config }: { id: TId; config?: QueryConfig<typeof OrderPaymentRequestsServices.findById> }) => {
    const { queryKey, ...rest } = config ?? {};

    return useQuery({
      queryKey: [...(queryKey || []), OrderPaymentRequestsServices.NAME, id],
      queryFn: () => OrderPaymentRequestsServices.findById(id),
      ...rest,
    });
  },

  useFind: ({
    options,
    config,
  }: {
    options: IOrderPaymentRequestsFilter;
    config?: QueryConfig<typeof OrderPaymentRequestsServices.find>;
  }) => {
    const { queryKey, ...rest } = config ?? {};

    return useQuery({
      queryKey: [...(queryKey || []), OrderPaymentRequestsServices.NAME, options],
      queryFn: () => OrderPaymentRequestsServices.find(options),
      ...rest,
    });
  },

  useFindInfinite: ({
    options,
    config,
  }: {
    options: IOrderPaymentRequestsFilter;
    config?: InfiniteQueryConfig<typeof OrderPaymentRequestsServices.find>;
  }) => {
    const { queryKey, ...rest } = config ?? {};

    return useInfiniteQuery({
      queryKey: [...(queryKey || []), OrderPaymentRequestsServices.NAME, options],
      queryFn: ({ pageParam }) => OrderPaymentRequestsServices.find({ ...options, page: pageParam }),
      initialPageParam: 1,
      getNextPageParam: (lastPage, allPages) => {
        if (!lastPage?.meta) return null;

        const totalFetched = allPages.reduce((count, page) => count + page.data.length, 0);
        return totalFetched < lastPage.meta.total ? lastPage.meta.page + 1 : null;
      },
      ...rest,
    });
  },

  useCreate: ({ config }: { config?: MutationConfig<typeof OrderPaymentRequestsServices.create> } = {}) => {
    return useMutation({
      mutationFn: OrderPaymentRequestsServices.create,
      onSettled: (data) => {
        if (!data?.success) return;

        queryClient.invalidateQueries({ queryKey: [OrderPaymentRequestsServices.NAME] });
        queryClient.invalidateQueries({ queryKey: [ProductsServices.NAME] });
      },
      ...config,
    });
  },

  useQuickCreate: ({ config }: { config?: MutationConfig<typeof OrderPaymentRequestsServices.quickCreate> } = {}) => {
    return useMutation({
      mutationFn: OrderPaymentRequestsServices.quickCreate,
      onSettled: (data) => {
        if (!data?.success) return;

        queryClient.invalidateQueries({ queryKey: [OrderPaymentRequestsServices.NAME] });
        queryClient.invalidateQueries({ queryKey: [ProductsServices.NAME] });
      },
      ...config,
    });
  },

  useUpdate: ({ config }: { config?: MutationConfig<typeof OrderPaymentRequestsServices.update> } = {}) => {
    return useMutation({
      mutationFn: OrderPaymentRequestsServices.update,
      onSettled: (data) => {
        if (!data?.success) return;

        queryClient.invalidateQueries({ queryKey: [OrderPaymentRequestsServices.NAME] });
      },
      ...config,
    });
  },

  useDelete: ({ config }: { config?: MutationConfig<typeof OrderPaymentRequestsServices.delete> } = {}) => {
    return useMutation({
      mutationFn: OrderPaymentRequestsServices.delete,
      onSettled: (data) => {
        if (!data?.success) return;

        queryClient.invalidateQueries({ queryKey: [OrderPaymentRequestsServices.NAME] });
      },
      ...config,
    });
  },
};
