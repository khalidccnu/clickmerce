import { TId } from '@base/interfaces';
import { QueryConfig } from '@lib/config/reactQuery';
import { useQuery } from '@tanstack/react-query';
import { IProductsFilter } from './interfaces';
import { ProductsWebServices } from './webServices';

export const ProductsHooks = {
  useFindById: ({ id, config }: { id: TId; config?: QueryConfig<typeof ProductsWebServices.findById> }) => {
    const { queryKey, ...rest } = config ?? {};

    return useQuery({
      queryKey: [...(queryKey || []), ProductsWebServices.NAME, id],
      queryFn: () => ProductsWebServices.findById(id),
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
