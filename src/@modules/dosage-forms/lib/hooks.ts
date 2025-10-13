import { TId } from '@base/interfaces';
import { InfiniteQueryConfig, MutationConfig, queryClient, QueryConfig } from '@lib/config/reactQuery';
import { useInfiniteQuery, useMutation, useQuery } from '@tanstack/react-query';
import { IDosageFormsFilter } from './interfaces';
import { DosageFormsServices } from './services';

export const DosageFormsHooks = {
  useFindById: ({ id, config }: { id: TId; config?: QueryConfig<typeof DosageFormsServices.findById> }) => {
    const { queryKey, ...rest } = config ?? {};

    return useQuery({
      queryKey: [...(queryKey || []), DosageFormsServices.NAME, id],
      queryFn: () => DosageFormsServices.findById(id),
      ...rest,
    });
  },

  useFind: ({
    options,
    config,
  }: {
    options: IDosageFormsFilter;
    config?: QueryConfig<typeof DosageFormsServices.find>;
  }) => {
    const { queryKey, ...rest } = config ?? {};

    return useQuery({
      queryKey: [...(queryKey || []), DosageFormsServices.NAME, options],
      queryFn: () => DosageFormsServices.find(options),
      ...rest,
    });
  },

  useFindInfinite: ({
    options,
    config,
  }: {
    options: IDosageFormsFilter;
    config?: InfiniteQueryConfig<typeof DosageFormsServices.find>;
  }) => {
    const { queryKey, ...rest } = config ?? {};

    return useInfiniteQuery({
      queryKey: [...(queryKey || []), DosageFormsServices.NAME, options],
      queryFn: ({ pageParam }) => DosageFormsServices.find({ ...options, page: pageParam }),
      initialPageParam: 1,
      getNextPageParam: (lastPage, allPages) => {
        if (!lastPage?.meta) return null;

        const totalFetched = allPages.reduce((count, page) => count + page.data.length, 0);
        return totalFetched < lastPage.meta.total ? lastPage.meta.page + 1 : null;
      },
      ...rest,
    });
  },

  useCreate: ({ config }: { config?: MutationConfig<typeof DosageFormsServices.create> } = {}) => {
    return useMutation({
      mutationFn: DosageFormsServices.create,
      onSettled: (data) => {
        if (!data?.success) return;

        queryClient.invalidateQueries({ queryKey: [DosageFormsServices.NAME] });
      },
      ...config,
    });
  },

  useUpdate: ({ config }: { config?: MutationConfig<typeof DosageFormsServices.update> } = {}) => {
    return useMutation({
      mutationFn: DosageFormsServices.update,
      onSettled: (data) => {
        if (!data?.success) return;

        queryClient.invalidateQueries({ queryKey: [DosageFormsServices.NAME] });
      },
      ...config,
    });
  },

  useDelete: ({ config }: { config?: MutationConfig<typeof DosageFormsServices.delete> } = {}) => {
    return useMutation({
      mutationFn: DosageFormsServices.delete,
      onSettled: (data) => {
        if (!data?.success) return;

        queryClient.invalidateQueries({ queryKey: [DosageFormsServices.NAME] });
      },
      ...config,
    });
  },
};
