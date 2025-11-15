import { TId } from '@base/interfaces';
import { MutationConfig, QueryConfig } from '@lib/config/reactQuery';
import { useMutation, useQuery } from '@tanstack/react-query';
import { IProductsFilter } from './interfaces';
import { ProductsWebServices } from './webServices';

export const ProductsWebHooks = {
  useFindBySlug: ({ slug, config }: { slug: TId; config?: QueryConfig<typeof ProductsWebServices.findBySlug> }) => {
    const { queryKey, ...rest } = config ?? {};

    return useQuery({
      queryKey: [...(queryKey || []), ProductsWebServices.NAME, slug],
      queryFn: () => ProductsWebServices.findBySlug(slug),
      ...rest,
    });
  },

  useFindBulk: ({ config }: { config?: MutationConfig<typeof ProductsWebServices.findBulk> } = {}) => {
    return useMutation({
      mutationFn: ProductsWebServices.findBulk,
      onSettled: (data) => {
        if (!data?.success) return;
      },
      ...config,
    });
  },

  useFind: ({
    options,
    config,
  }: {
    options: IProductsFilter;
    config?: QueryConfig<typeof ProductsWebServices.find>;
  }) => {
    const { queryKey, ...rest } = config ?? {};

    return useQuery({
      queryKey: [...(queryKey || []), ProductsWebServices.NAME, options],
      queryFn: () => ProductsWebServices.find(options),
      ...rest,
    });
  },
};
