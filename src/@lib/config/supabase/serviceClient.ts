import { Env } from '.environments';
import { createClient } from '@supabase/supabase-js';

export const createSupabaseServiceClient = () => {
  return createClient(Env.supabaseUrl, Env.supabaseServiceRoleKey);
};

export const supabaseServiceClient = createSupabaseServiceClient();
