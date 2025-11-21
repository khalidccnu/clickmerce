import { TId } from '@base/interfaces';
import { InfiniteQueryConfig, MutationConfig, queryClient, QueryConfig } from '@lib/config/reactQuery';
import { useInfiniteQuery, useMutation, useQuery } from '@tanstack/react-query';
import { IReviewsFilter } from './interfaces';
import { ReviewsServices } from './services';

export const ReviewsHooks = {
  useFindById: ({ id, config }: { id: TId; config?: QueryConfig<typeof ReviewsServices.findById> }) => {
    const { queryKey, ...rest } = config ?? {};

    return useQuery({
      queryKey: [...(queryKey || []), ReviewsServices.NAME, id],
      queryFn: () => ReviewsServices.findById(id),
      ...rest,
    });
  },

  useFind: ({ options, config }: { options: IReviewsFilter; config?: QueryConfig<typeof ReviewsServices.find> }) => {
    const { queryKey, ...rest } = config ?? {};

    return useQuery({
      queryKey: [...(queryKey || []), ReviewsServices.NAME, options],
      queryFn: () => ReviewsServices.find(options),
      ...rest,
    });
  },

  useFindQuick: ({
    options,
    config,
  }: {
    options: IReviewsFilter;
    config?: QueryConfig<typeof ReviewsServices.findQuick>;
  }) => {
    const { queryKey, ...rest } = config ?? {};

    return useQuery({
      queryKey: [...(queryKey || []), ReviewsServices.NAME, options],
      queryFn: () => ReviewsServices.findQuick(options),
      ...rest,
    });
  },

  useFindInfinite: ({
    options,
    config,
  }: {
    options: IReviewsFilter;
    config?: InfiniteQueryConfig<typeof ReviewsServices.find>;
  }) => {
    const { queryKey, ...rest } = config ?? {};

    return useInfiniteQuery({
      queryKey: [...(queryKey || []), ReviewsServices.NAME, options],
      queryFn: ({ pageParam }) => ReviewsServices.find({ ...options, page: pageParam }),
      initialPageParam: 1,
      getNextPageParam: (lastPage, allPages) => {
        if (!lastPage?.meta) return null;

        const totalFetched = allPages.reduce((count, page) => count + page.data.length, 0);
        return totalFetched < lastPage.meta.total ? lastPage.meta.page + 1 : null;
      },
      ...rest,
    });
  },

  useCreate: ({ config }: { config?: MutationConfig<typeof ReviewsServices.create> } = {}) => {
    return useMutation({
      mutationFn: ReviewsServices.create,
      onSettled: (data) => {
        if (!data?.success) return;

        queryClient.invalidateQueries({ queryKey: [ReviewsServices.NAME] });
      },
      ...config,
    });
  },

  useUpdate: ({ config }: { config?: MutationConfig<typeof ReviewsServices.update> } = {}) => {
    return useMutation({
      mutationFn: ReviewsServices.update,
      onSettled: (data) => {
        if (!data?.success) return;

        queryClient.invalidateQueries({ queryKey: [ReviewsServices.NAME] });
      },
      ...config,
    });
  },

  useDelete: ({ config }: { config?: MutationConfig<typeof ReviewsServices.delete> } = {}) => {
    return useMutation({
      mutationFn: ReviewsServices.delete,
      onSettled: (data) => {
        if (!data?.success) return;

        queryClient.invalidateQueries({ queryKey: [ReviewsServices.NAME] });
      },
      ...config,
    });
  },
};
