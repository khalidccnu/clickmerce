import { MutationConfig, queryClient, QueryConfig } from '@lib/config/reactQuery';
import { useMutation, useQuery } from '@tanstack/react-query';
import { SettingsServices } from './services';

export const SettingsHooks = {
  useFind: ({ config }: { config?: QueryConfig<typeof SettingsServices.find> } = {}) => {
    const { queryKey, ...rest } = config ?? {};

    return useQuery({
      queryKey: [...(queryKey || []), SettingsServices.NAME],
      queryFn: () => SettingsServices.find(),
      ...rest,
    });
  },

  useUpdate: ({ config }: { config?: MutationConfig<typeof SettingsServices.update> } = {}) => {
    return useMutation({
      mutationFn: SettingsServices.update,
      onSettled: (data) => {
        if (!data?.success) return;

        queryClient.invalidateQueries({ queryKey: [SettingsServices.NAME] });
      },
      ...config,
    });
  },
};
