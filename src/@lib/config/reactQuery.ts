import {
  InfiniteData,
  QueryClient,
  UseInfiniteQueryOptions,
  UseMutationOptions,
  UseQueryOptions,
} from '@tanstack/react-query';
import { PromiseValue } from 'type-fest';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

export type QueryConfig<FetcherFnType extends (...args: any) => any> = UseQueryOptions<
  PromiseValue<ReturnType<FetcherFnType>>
>;

export type InfiniteQueryConfig<FetcherFnType extends (...args: any) => any> = Omit<
  UseInfiniteQueryOptions<
    PromiseValue<ReturnType<FetcherFnType>>,
    Error,
    InfiniteData<PromiseValue<ReturnType<FetcherFnType>>>,
    any[],
    any
  >,
  'initialPageParam' | 'getNextPageParam'
> & {
  initialPageParam?: any;
  getNextPageParam?: (
    lastPage: PromiseValue<ReturnType<FetcherFnType>>,
    allPages: PromiseValue<ReturnType<FetcherFnType>>[],
  ) => any;
};

export type MutationConfig<FetcherFnType extends (...args: any) => any> = UseMutationOptions<
  PromiseValue<ReturnType<FetcherFnType>>,
  Error,
  Parameters<FetcherFnType>[0]
>;
