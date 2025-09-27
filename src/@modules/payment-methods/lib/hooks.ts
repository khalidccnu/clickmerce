import { TId } from '@base/interfaces';
import { InfiniteQueryConfig, MutationConfig, queryClient, QueryConfig } from '@lib/config/reactQuery';
import { useInfiniteQuery, useMutation, useQuery } from '@tanstack/react-query';
import { IPaymentMethodsFilter } from './interfaces';
import { PaymentMethodsServices } from './services';

export const PaymentMethodsHooks = {
  useFindById: ({ id, config }: { id: TId; config?: QueryConfig<typeof PaymentMethodsServices.findById> }) => {
    const { queryKey, ...rest } = config ?? {};

    return useQuery({
      queryKey: [...(queryKey || []), PaymentMethodsServices.NAME, id],
      queryFn: () => PaymentMethodsServices.findById(id),
      ...rest,
    });
  },

  useFind: ({
    options,
    config,
  }: {
    options: IPaymentMethodsFilter;
    config?: QueryConfig<typeof PaymentMethodsServices.find>;
  }) => {
    const { queryKey, ...rest } = config ?? {};

    return useQuery({
      queryKey: [...(queryKey || []), PaymentMethodsServices.NAME, options],
      queryFn: () => PaymentMethodsServices.find(options),
      ...rest,
    });
  },

  useFindInfinite: ({
    options,
    config,
  }: {
    options: IPaymentMethodsFilter;
    config?: InfiniteQueryConfig<typeof PaymentMethodsServices.find>;
  }) => {
    const { queryKey, ...rest } = config ?? {};

    return useInfiniteQuery({
      queryKey: [...(queryKey || []), PaymentMethodsServices.NAME, options],
      queryFn: ({ pageParam }) => PaymentMethodsServices.find({ ...options, page: pageParam }),
      initialPageParam: 1,
      getNextPageParam: (lastPage, allPages) => {
        if (!lastPage?.meta) return null;

        const totalFetched = allPages.reduce((count, page) => count + page.data.length, 0);
        return totalFetched < lastPage.meta.total ? lastPage.meta.page + 1 : null;
      },
      ...rest,
    });
  },

  useCreate: ({ config }: { config?: MutationConfig<typeof PaymentMethodsServices.create> } = {}) => {
    return useMutation({
      mutationFn: PaymentMethodsServices.create,
      onSettled: (data) => {
        if (!data?.success) return;

        queryClient.invalidateQueries({ queryKey: [PaymentMethodsServices.NAME] });
      },
      ...config,
    });
  },

  useUpdate: ({ config }: { config?: MutationConfig<typeof PaymentMethodsServices.update> } = {}) => {
    return useMutation({
      mutationFn: PaymentMethodsServices.update,
      onSettled: (data) => {
        if (!data?.success) return;

        queryClient.invalidateQueries({ queryKey: [PaymentMethodsServices.NAME] });
      },
      ...config,
    });
  },
};
