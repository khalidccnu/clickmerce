import { Env } from '.environments';
import { getAuthToken } from '@modules/auth/lib/utils/client';
import { createBrowserClient } from '@supabase/ssr';

export const createSupabaseBrowserClient = () => {
  const token = getAuthToken();
  let purifiedToken = {};

  if (token) {
    purifiedToken = {
      Authorization: `Bearer ${token}`,
    };
  }

  return createBrowserClient(Env.supabaseUrl, Env.supabasePublishableOrAnonKey, {
    global: {
      headers: purifiedToken,
    },
  });
};

export const supabaseBrowserClient = createSupabaseBrowserClient();
