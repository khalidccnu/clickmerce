import { IBaseResponse } from '@base/interfaces';
import { createSupabaseBrowserClient } from '@lib/config/supabase';
import { Database } from '@lib/constant/database';
import { SupabaseAdapter } from '@lib/utils/supabaseAdapter';
import { getServerAuthSession } from '@modules/auth/lib/utils';
import { IUser } from '@modules/users/lib/interfaces';
import { NextApiRequest, NextApiResponse } from 'next';
import { jwtVerify } from '../utils/jwt';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    const response: IBaseResponse = {
      success: false,
      statusCode: 405,
      message: 'Method not allowed',
      data: null,
      meta: null,
    };

    return res.status(405).json(response);
  }

  try {
    const { token } = getServerAuthSession(req);
    const supabaseBrowserClient = createSupabaseBrowserClient(token);

    if (!token) {
      const response: IBaseResponse = {
        success: false,
        statusCode: 401,
        message: 'No token provided',
        data: null,
        meta: null,
      };

      return res.status(401).json(response);
    }

    const payload = jwtVerify(token);

    if (!payload) {
      const response: IBaseResponse = {
        success: false,
        statusCode: 401,
        message: 'Invalid token',
        data: null,
        meta: null,
      };

      return res.status(401).json(response);
    }

    const user = await SupabaseAdapter.findById<IUser & { password: string }>(
      supabaseBrowserClient,
      Database.users,
      payload.user.id,
      {
        selection: '*, user_info:users_info(*), user_roles(*)',
      },
    );

    const { password: _, ...safeUser } = user.data || {};

    if (!user.success || !user.data) {
      const response: IBaseResponse = {
        success: false,
        statusCode: 401,
        message: 'User not found',
        data: null,
        meta: null,
      };

      return res.status(401).json(response);
    }

    const response: IBaseResponse<typeof safeUser> = {
      success: true,
      statusCode: 200,
      message: 'User profile retrieved successfully',
      data: safeUser,
      meta: null,
    };

    return res.status(200).json(response);
  } catch (error) {
    const response: IBaseResponse = {
      success: false,
      statusCode: 500,
      message: 'Failed to retrieve user profile',
      data: null,
      meta: null,
    };

    return res.status(500).json(response);
  }
}
