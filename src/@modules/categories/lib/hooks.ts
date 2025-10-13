import { TId } from '@base/interfaces';
import { InfiniteQueryConfig, MutationConfig, queryClient, QueryConfig } from '@lib/config/reactQuery';
import { useInfiniteQuery, useMutation, useQuery } from '@tanstack/react-query';
import { ICategoriesFilter } from './interfaces';
import { CategoriesServices } from './services';

export const CategoriesHooks = {
  useFindById: ({ id, config }: { id: TId; config?: QueryConfig<typeof CategoriesServices.findById> }) => {
    const { queryKey, ...rest } = config ?? {};

    return useQuery({
      queryKey: [...(queryKey || []), CategoriesServices.NAME, id],
      queryFn: () => CategoriesServices.findById(id),
      ...rest,
    });
  },

  useFind: ({
    options,
    config,
  }: {
    options: ICategoriesFilter;
    config?: QueryConfig<typeof CategoriesServices.find>;
  }) => {
    const { queryKey, ...rest } = config ?? {};

    return useQuery({
      queryKey: [...(queryKey || []), CategoriesServices.NAME, options],
      queryFn: () => CategoriesServices.find(options),
      ...rest,
    });
  },

  useFindSpecifics: ({ config }: { config?: MutationConfig<typeof CategoriesServices.findSpecifics> } = {}) => {
    return useMutation({
      mutationFn: CategoriesServices.findSpecifics,
      onSettled: (data) => {
        if (!data?.success) return;
      },
      ...config,
    });
  },

  useFindInfinite: ({
    options,
    config,
  }: {
    options: ICategoriesFilter;
    config?: InfiniteQueryConfig<typeof CategoriesServices.find>;
  }) => {
    const { queryKey, ...rest } = config ?? {};

    return useInfiniteQuery({
      queryKey: [...(queryKey || []), CategoriesServices.NAME, options],
      queryFn: ({ pageParam }) => CategoriesServices.find({ ...options, page: pageParam }),
      initialPageParam: 1,
      getNextPageParam: (lastPage, allPages) => {
        if (!lastPage?.meta) return null;

        const totalFetched = allPages.reduce((count, page) => count + page.data.length, 0);
        return totalFetched < lastPage.meta.total ? lastPage.meta.page + 1 : null;
      },
      ...rest,
    });
  },

  useCreate: ({ config }: { config?: MutationConfig<typeof CategoriesServices.create> } = {}) => {
    return useMutation({
      mutationFn: CategoriesServices.create,
      onSettled: (data) => {
        if (!data?.success) return;

        queryClient.invalidateQueries({ queryKey: [CategoriesServices.NAME] });
      },
      ...config,
    });
  },

  useUpdate: ({ config }: { config?: MutationConfig<typeof CategoriesServices.update> } = {}) => {
    return useMutation({
      mutationFn: CategoriesServices.update,
      onSettled: (data) => {
        if (!data?.success) return;

        queryClient.invalidateQueries({ queryKey: [CategoriesServices.NAME] });
      },
      ...config,
    });
  },

  useDelete: ({ config }: { config?: MutationConfig<typeof CategoriesServices.delete> } = {}) => {
    return useMutation({
      mutationFn: CategoriesServices.delete,
      onSettled: (data) => {
        if (!data?.success) return;

        queryClient.invalidateQueries({ queryKey: [CategoriesServices.NAME] });
      },
      ...config,
    });
  },
};
