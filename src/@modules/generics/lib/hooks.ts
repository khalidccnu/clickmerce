import { TId } from '@base/interfaces';
import { InfiniteQueryConfig, MutationConfig, queryClient, QueryConfig } from '@lib/config/reactQuery';
import { useInfiniteQuery, useMutation, useQuery } from '@tanstack/react-query';
import { IGenericsFilter } from './interfaces';
import { GenericsServices } from './services';

export const GenericsHooks = {
  useFindById: ({ id, config }: { id: TId; config?: QueryConfig<typeof GenericsServices.findById> }) => {
    const { queryKey, ...rest } = config ?? {};

    return useQuery({
      queryKey: [...(queryKey || []), GenericsServices.NAME, id],
      queryFn: () => GenericsServices.findById(id),
      ...rest,
    });
  },

  useFind: ({ options, config }: { options: IGenericsFilter; config?: QueryConfig<typeof GenericsServices.find> }) => {
    const { queryKey, ...rest } = config ?? {};

    return useQuery({
      queryKey: [...(queryKey || []), GenericsServices.NAME, options],
      queryFn: () => GenericsServices.find(options),
      ...rest,
    });
  },

  useFindInfinite: ({
    options,
    config,
  }: {
    options: IGenericsFilter;
    config?: InfiniteQueryConfig<typeof GenericsServices.find>;
  }) => {
    const { queryKey, ...rest } = config ?? {};

    return useInfiniteQuery({
      queryKey: [...(queryKey || []), GenericsServices.NAME, options],
      queryFn: ({ pageParam }) => GenericsServices.find({ ...options, page: pageParam }),
      initialPageParam: 1,
      getNextPageParam: (lastPage, allPages) => {
        if (!lastPage?.meta) return null;

        const totalFetched = allPages.reduce((count, page) => count + page.data.length, 0);
        return totalFetched < lastPage.meta.total ? lastPage.meta.page + 1 : null;
      },
      ...rest,
    });
  },

  useCreate: ({ config }: { config?: MutationConfig<typeof GenericsServices.create> } = {}) => {
    return useMutation({
      mutationFn: GenericsServices.create,
      onSettled: (data) => {
        if (!data?.success) return;

        queryClient.invalidateQueries({ queryKey: [GenericsServices.NAME] });
      },
      ...config,
    });
  },

  useUpdate: ({ config }: { config?: MutationConfig<typeof GenericsServices.update> } = {}) => {
    return useMutation({
      mutationFn: GenericsServices.update,
      onSettled: (data) => {
        if (!data?.success) return;

        queryClient.invalidateQueries({ queryKey: [GenericsServices.NAME] });
      },
      ...config,
    });
  },

  useDelete: ({ config }: { config?: MutationConfig<typeof GenericsServices.delete> } = {}) => {
    return useMutation({
      mutationFn: GenericsServices.delete,
      onSettled: (data) => {
        if (!data?.success) return;

        queryClient.invalidateQueries({ queryKey: [GenericsServices.NAME] });
      },
      ...config,
    });
  },
};
