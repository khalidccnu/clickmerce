import { MutationConfig, QueryConfig } from '@lib/config/reactQuery';
import { useMutation, useQuery } from '@tanstack/react-query';
import { AuthServices } from './services';
import { clearAuthSession } from './utils';

export const AuthHooks = {
  useProfile: ({ config }: { config?: QueryConfig<typeof AuthServices.profile> } = {}) => {
    const { queryKey, ...rest } = config ?? {};

    return useQuery({
      queryKey: [...(queryKey || []), AuthServices.NAME],
      queryFn: AuthServices.profile,
      ...rest,
    });
  },

  useSignIn: ({ config }: { config?: MutationConfig<typeof AuthServices.signIn> } = {}) => {
    return useMutation({
      mutationFn: AuthServices.signIn,
      ...config,
    });
  },

  usePasswordUpdate: ({ config }: { config?: MutationConfig<typeof AuthServices.passwordUpdate> } = {}) => {
    return useMutation({
      mutationFn: AuthServices.passwordUpdate,
      onSettled: (data) => {
        if (!data?.success) return;
      },
      ...config,
    });
  },

  useSignOut: () => {
    clearAuthSession();
    window.location.reload();
  },
};
