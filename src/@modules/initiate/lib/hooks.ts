import { MutationConfig } from '@lib/config/reactQuery';
import { useMutation } from '@tanstack/react-query';
import { InitiateService } from './services';

export const InitiateHook = {
  useCreate: ({ config }: { config?: MutationConfig<typeof InitiateService.create> } = {}) => {
    return useMutation({
      mutationFn: InitiateService.create,
      onSettled: (data) => {
        if (!data?.success) return;
      },
      ...config,
    });
  },
};
