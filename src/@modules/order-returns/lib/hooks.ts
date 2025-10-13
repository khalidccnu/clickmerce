import { TId } from '@base/interfaces';
import { InfiniteQueryConfig, MutationConfig, queryClient, QueryConfig } from '@lib/config/reactQuery';
import { ProductsServices } from '@modules/products/lib/services';
import { useInfiniteQuery, useMutation, useQuery } from '@tanstack/react-query';
import { IOrderReturnsFilter } from './interfaces';
import { OrderReturnsServices } from './services';

export const OrderReturnsHooks = {
  useFindById: ({ id, config }: { id: TId; config?: QueryConfig<typeof OrderReturnsServices.findById> }) => {
    const { queryKey, ...rest } = config ?? {};

    return useQuery({
      queryKey: [...(queryKey || []), OrderReturnsServices.NAME, id],
      queryFn: () => OrderReturnsServices.findById(id),
      ...rest,
    });
  },

  useFind: ({
    options,
    config,
  }: {
    options: IOrderReturnsFilter;
    config?: QueryConfig<typeof OrderReturnsServices.find>;
  }) => {
    const { queryKey, ...rest } = config ?? {};

    return useQuery({
      queryKey: [...(queryKey || []), OrderReturnsServices.NAME, options],
      queryFn: () => OrderReturnsServices.find(options),
      ...rest,
    });
  },

  useFindInfinite: ({
    options,
    config,
  }: {
    options: IOrderReturnsFilter;
    config?: InfiniteQueryConfig<typeof OrderReturnsServices.find>;
  }) => {
    const { queryKey, ...rest } = config ?? {};

    return useInfiniteQuery({
      queryKey: [...(queryKey || []), OrderReturnsServices.NAME, options],
      queryFn: ({ pageParam }) => OrderReturnsServices.find({ ...options, page: pageParam }),
      initialPageParam: 1,
      getNextPageParam: (lastPage, allPages) => {
        if (!lastPage?.meta) return null;

        const totalFetched = allPages.reduce((count, page) => count + page.data.length, 0);
        return totalFetched < lastPage.meta.total ? lastPage.meta.page + 1 : null;
      },
      ...rest,
    });
  },

  useCreate: ({ config }: { config?: MutationConfig<typeof OrderReturnsServices.create> } = {}) => {
    return useMutation({
      mutationFn: OrderReturnsServices.create,
      onSettled: (data) => {
        if (!data?.success) return;

        queryClient.invalidateQueries({ queryKey: [OrderReturnsServices.NAME] });
        queryClient.invalidateQueries({ queryKey: [ProductsServices.NAME] });
      },
      ...config,
    });
  },

  useUpdate: ({ config }: { config?: MutationConfig<typeof OrderReturnsServices.update> } = {}) => {
    return useMutation({
      mutationFn: OrderReturnsServices.update,
      onSettled: (data) => {
        if (!data?.success) return;

        queryClient.invalidateQueries({ queryKey: [OrderReturnsServices.NAME] });
      },
      ...config,
    });
  },
};
