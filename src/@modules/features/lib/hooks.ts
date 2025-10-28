import { TId } from '@base/interfaces';
import { InfiniteQueryConfig, MutationConfig, queryClient, QueryConfig } from '@lib/config/reactQuery';
import { useInfiniteQuery, useMutation, useQuery } from '@tanstack/react-query';
import { IFeaturesFilter } from './interfaces';
import { FeaturesServices } from './services';

export const FeaturesHooks = {
  useFindById: ({ id, config }: { id: TId; config?: QueryConfig<typeof FeaturesServices.findById> }) => {
    const { queryKey, ...rest } = config ?? {};

    return useQuery({
      queryKey: [...(queryKey || []), FeaturesServices.NAME, id],
      queryFn: () => FeaturesServices.findById(id),
      ...rest,
    });
  },

  useFind: ({ options, config }: { options: IFeaturesFilter; config?: QueryConfig<typeof FeaturesServices.find> }) => {
    const { queryKey, ...rest } = config ?? {};

    return useQuery({
      queryKey: [...(queryKey || []), FeaturesServices.NAME, options],
      queryFn: () => FeaturesServices.find(options),
      ...rest,
    });
  },

  useFindInfinite: ({
    options,
    config,
  }: {
    options: IFeaturesFilter;
    config?: InfiniteQueryConfig<typeof FeaturesServices.find>;
  }) => {
    const { queryKey, ...rest } = config ?? {};

    return useInfiniteQuery({
      queryKey: [...(queryKey || []), FeaturesServices.NAME, options],
      queryFn: ({ pageParam }) => FeaturesServices.find({ ...options, page: pageParam }),
      initialPageParam: 1,
      getNextPageParam: (lastPage, allPages) => {
        if (!lastPage?.meta) return null;

        const totalFetched = allPages.reduce((count, page) => count + page.data.length, 0);
        return totalFetched < lastPage.meta.total ? lastPage.meta.page + 1 : null;
      },
      ...rest,
    });
  },

  useCreate: ({ config }: { config?: MutationConfig<typeof FeaturesServices.create> } = {}) => {
    return useMutation({
      mutationFn: FeaturesServices.create,
      onSettled: (data) => {
        if (!data?.success) return;

        queryClient.invalidateQueries({ queryKey: [FeaturesServices.NAME] });
      },
      ...config,
    });
  },

  useUpdate: ({ config }: { config?: MutationConfig<typeof FeaturesServices.update> } = {}) => {
    return useMutation({
      mutationFn: FeaturesServices.update,
      onSettled: (data) => {
        if (!data?.success) return;

        queryClient.invalidateQueries({ queryKey: [FeaturesServices.NAME] });
      },
      ...config,
    });
  },

  useDelete: ({ config }: { config?: MutationConfig<typeof FeaturesServices.delete> } = {}) => {
    return useMutation({
      mutationFn: FeaturesServices.delete,
      onSettled: (data) => {
        if (!data?.success) return;

        queryClient.invalidateQueries({ queryKey: [FeaturesServices.NAME] });
      },
      ...config,
    });
  },
};
