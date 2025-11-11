import { MutationConfig, QueryConfig } from '@lib/config/reactQuery';
import { useMutation, useQuery } from '@tanstack/react-query';
import { AuthServices } from './services';
import { clearAuthSession } from './utils/client';

export const AuthHooks = {
  useProfile: ({ config }: { config?: QueryConfig<typeof AuthServices.profile> } = {}) => {
    const { queryKey, ...rest } = config ?? {};

    return useQuery({
      queryKey: [...(queryKey || []), AuthServices.NAME],
      queryFn: AuthServices.profile,
      ...rest,
    });
  },

  useLogin: ({ config }: { config?: MutationConfig<typeof AuthServices.login> } = {}) => {
    return useMutation({
      mutationFn: AuthServices.login,
      ...config,
    });
  },

  useRegister: ({ config }: { config?: MutationConfig<typeof AuthServices.register> } = {}) => {
    return useMutation({
      ...config,
      mutationFn: AuthServices.register,
    });
  },

  usePasswordResetRequest: ({ config }: { config?: MutationConfig<typeof AuthServices.passwordResetRequest> } = {}) => {
    return useMutation({
      ...config,
      mutationFn: AuthServices.passwordResetRequest,
      onSettled: (data) => {
        if (!data?.success) return;
      },
    });
  },

  usePasswordReset: ({ config }: { config?: MutationConfig<typeof AuthServices.passwordReset> } = {}) => {
    return useMutation({
      ...config,
      mutationFn: AuthServices.passwordReset,
      onSettled: (data) => {
        if (!data?.success) return;
      },
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

  useProfileVerifyRequest: ({ config }: { config?: MutationConfig<typeof AuthServices.profileVerifyRequest> } = {}) => {
    return useMutation({
      ...config,
      mutationFn: AuthServices.profileVerifyRequest,
      onSettled: (data) => {
        if (!data?.success) return;
      },
    });
  },

  useProfileVerify: ({ config }: { config?: MutationConfig<typeof AuthServices.profileVerify> } = {}) => {
    return useMutation({
      ...config,
      mutationFn: AuthServices.profileVerify,
      onSettled: (data) => {
        if (!data?.success) return;
      },
    });
  },

  useLogout: () => {
    clearAuthSession();
    window.location.reload();
  },
};
