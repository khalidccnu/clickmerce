import { TId } from '@base/interfaces';
import { InfiniteQueryConfig, MutationConfig, queryClient, QueryConfig } from '@lib/config/reactQuery';
import { useInfiniteQuery, useMutation, useQuery } from '@tanstack/react-query';
import { IGalleriesFilter } from './interfaces';
import { GalleriesServices } from './services';

export const GalleriesHooks = {
  useFindById: ({ id, config }: { id: TId; config?: QueryConfig<typeof GalleriesServices.findById> }) => {
    const { queryKey, ...rest } = config ?? {};

    return useQuery({
      queryKey: [...(queryKey || []), GalleriesServices.NAME, id],
      queryFn: () => GalleriesServices.findById(id),
      ...rest,
    });
  },

  useFind: ({
    options,
    config,
  }: {
    options: IGalleriesFilter;
    config?: QueryConfig<typeof GalleriesServices.find>;
  }) => {
    const { queryKey, ...rest } = config ?? {};

    return useQuery({
      queryKey: [...(queryKey || []), GalleriesServices.NAME, options],
      queryFn: () => GalleriesServices.find(options),
      ...rest,
    });
  },

  useFindInfinite: ({
    options,
    config,
  }: {
    options: IGalleriesFilter;
    config?: InfiniteQueryConfig<typeof GalleriesServices.find>;
  }) => {
    const { queryKey, ...rest } = config ?? {};

    return useInfiniteQuery({
      queryKey: [...(queryKey || []), GalleriesServices.NAME, options],
      queryFn: ({ pageParam }) => GalleriesServices.find({ ...options, page: pageParam }),
      initialPageParam: 1,
      getNextPageParam: (lastPage, allPages) => {
        if (!lastPage?.meta) return null;

        const totalFetched = allPages.reduce((count, page) => count + page.data.length, 0);
        return totalFetched < lastPage.meta.total ? lastPage.meta.page + 1 : null;
      },
      ...rest,
    });
  },

  useCreate: ({ config }: { config?: MutationConfig<typeof GalleriesServices.create> } = {}) => {
    return useMutation({
      mutationFn: GalleriesServices.create,
      onSettled: (data) => {
        if (!data?.success) return;

        queryClient.invalidateQueries({ queryKey: [GalleriesServices.NAME] });
      },
      ...config,
    });
  },

  useUpdate: ({ config }: { config?: MutationConfig<typeof GalleriesServices.update> } = {}) => {
    return useMutation({
      mutationFn: GalleriesServices.update,
      onSettled: (data) => {
        if (!data?.success) return;

        queryClient.invalidateQueries({ queryKey: [GalleriesServices.NAME] });
      },
      ...config,
    });
  },

  useDelete: ({ config }: { config?: MutationConfig<typeof GalleriesServices.delete> } = {}) => {
    return useMutation({
      mutationFn: GalleriesServices.delete,
      onSettled: (data) => {
        if (!data?.success) return;

        queryClient.invalidateQueries({ queryKey: [GalleriesServices.NAME] });
      },
      ...config,
    });
  },
};
