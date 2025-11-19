import { TId } from '@base/interfaces';
import { InfiniteQueryConfig, MutationConfig, queryClient, QueryConfig } from '@lib/config/reactQuery';
import { useInfiniteQuery, useMutation, useQuery } from '@tanstack/react-query';
import { ICouponsFilter } from './interfaces';
import { CouponsServices } from './services';

export const CouponsHooks = {
  useFindById: ({ id, config }: { id: TId; config?: QueryConfig<typeof CouponsServices.findById> }) => {
    const { queryKey, ...rest } = config ?? {};

    return useQuery({
      queryKey: [...(queryKey || []), CouponsServices.NAME, id],
      queryFn: () => CouponsServices.findById(id),
      ...rest,
    });
  },

  useFind: ({ options, config }: { options: ICouponsFilter; config?: QueryConfig<typeof CouponsServices.find> }) => {
    const { queryKey, ...rest } = config ?? {};

    return useQuery({
      queryKey: [...(queryKey || []), CouponsServices.NAME, options],
      queryFn: () => CouponsServices.find(options),
      ...rest,
    });
  },

  useFindInfinite: ({
    options,
    config,
  }: {
    options: ICouponsFilter;
    config?: InfiniteQueryConfig<typeof CouponsServices.find>;
  }) => {
    const { queryKey, ...rest } = config ?? {};

    return useInfiniteQuery({
      queryKey: [...(queryKey || []), CouponsServices.NAME, options],
      queryFn: ({ pageParam }) => CouponsServices.find({ ...options, page: pageParam }),
      initialPageParam: 1,
      getNextPageParam: (lastPage, allPages) => {
        if (!lastPage?.meta) return null;

        const totalFetched = allPages.reduce((count, page) => count + page.data.length, 0);
        return totalFetched < lastPage.meta.total ? lastPage.meta.page + 1 : null;
      },
      ...rest,
    });
  },

  useCreate: ({ config }: { config?: MutationConfig<typeof CouponsServices.create> } = {}) => {
    return useMutation({
      mutationFn: CouponsServices.create,
      onSettled: (data) => {
        if (!data?.success) return;

        queryClient.invalidateQueries({ queryKey: [CouponsServices.NAME] });
      },
      ...config,
    });
  },

  useUpdate: ({ config }: { config?: MutationConfig<typeof CouponsServices.update> } = {}) => {
    return useMutation({
      mutationFn: CouponsServices.update,
      onSettled: (data) => {
        if (!data?.success) return;

        queryClient.invalidateQueries({ queryKey: [CouponsServices.NAME] });
      },
      ...config,
    });
  },

  useValidate: ({ config }: { config?: MutationConfig<typeof CouponsServices.validate> } = {}) => {
    return useMutation({
      mutationFn: CouponsServices.validate,
      onSettled: (data) => {
        if (!data?.success) return;

        queryClient.invalidateQueries({ queryKey: [CouponsServices.NAME] });
      },
      ...config,
    });
  },
};
