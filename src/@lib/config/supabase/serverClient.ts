import { Env } from '.environments';
import { getServerAuthToken } from '@modules/auth/lib/utils/server';
import { createServerClient } from '@supabase/ssr';
import cookie from 'cookie';
import { NextApiRequest, NextApiResponse } from 'next';

export const createSupabaseServerClient = (req: NextApiRequest, res: NextApiResponse) => {
  const token = getServerAuthToken(req);
  let purifiedToken = {};

  if (token) {
    purifiedToken = {
      Authorization: `Bearer ${token}`,
    };
  }

  return createServerClient(Env.supabaseUrl, Env.supabasePublishableOrAnonKey, {
    cookies: {
      getAll() {
        return Object.entries(req.cookies).map(([name, value]) => ({
          name,
          value,
        }));
      },
      setAll(cookiesToSet) {
        const newCookies = cookiesToSet.map(({ name, value, options }) => cookie.serialize(name, value, options));

        const existingCookie = res.getHeader('Set-Cookie');

        if (existingCookie) {
          res.setHeader('Set-Cookie', [].concat(existingCookie, newCookies));
        } else {
          res.setHeader('Set-Cookie', newCookies);
        }
      },
    },
    global: {
      headers: purifiedToken,
    },
  });
};
