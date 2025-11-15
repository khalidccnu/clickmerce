import { TId } from '@base/interfaces';
import { QueryConfig } from '@lib/config/reactQuery';
import { useQuery } from '@tanstack/react-query';
import { IProductsFilter } from './interfaces';
import { ProductsWebServices } from './webServices';

export const ProductsHooks = {
  useFindBySlug: ({ slug, config }: { slug: TId; config?: QueryConfig<typeof ProductsWebServices.findBySlug> }) => {
    const { queryKey, ...rest } = config ?? {};

    return useQuery({
      queryKey: [...(queryKey || []), ProductsWebServices.NAME, slug],
      queryFn: () => ProductsWebServices.findBySlug(slug),
      ...rest,
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
