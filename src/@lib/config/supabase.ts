import { Env } from '.environments';
import { getAuthToken } from '@modules/auth/lib/utils';
import { createBrowserClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';

export const createSupabaseBrowserClient = (token?: string) => {
  const purifiedToken = token || getAuthToken();

  return createBrowserClient(Env.supabaseUrl, Env.supabasePublishableOrAnonKey, {
    global: {
      headers: {
        Authorization: purifiedToken ? `Bearer ${purifiedToken}` : null,
      },
    },
  });
};

export const supabaseBrowserClient = createSupabaseBrowserClient();

export const createSupabaseServiceClient = () => {
  return createClient(Env.supabaseUrl, Env.supabaseServiceRoleKey);
};

export const supabaseServiceClient = createSupabaseServiceClient();
