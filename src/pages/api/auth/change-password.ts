import { IBaseResponse } from '@base/interfaces';
import { createSupabaseBrowserClient } from '@lib/config/supabase';
import { Database } from '@lib/constant/database';
import { SupabaseAdapter } from '@lib/utils/supabaseAdapter';
import { getServerAuthSession } from '@modules/auth/lib/utils';
import { IUser } from '@modules/users/lib/interfaces';
import bcrypt from 'bcryptjs';
import { NextApiRequest, NextApiResponse } from 'next';
import { jwtVerify } from '../utils/jwt';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'PATCH') {
    const response: IBaseResponse = {
      success: false,
      statusCode: 405,
      message: 'Method not allowed',
      data: null,
      meta: null,
    };

    return res.status(405).json(response);
  }

  const { current_password, new_password } = req.body;
  const { token } = getServerAuthSession(req);

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

  if (!payload.user.id || !current_password || !new_password) {
    const response: IBaseResponse = {
      success: false,
      statusCode: 400,
      message: 'Missing current password or new password',
      data: null,
      meta: null,
    };

    return res.status(400).json(response);
  }

  const supabaseBrowserClient = createSupabaseBrowserClient(token);

  const user = await SupabaseAdapter.findById<IUser & { password: string }>(
    supabaseBrowserClient,
    Database.users,
    payload.user.id,
  );

  if (!user.success || !user.data) {
    const response: IBaseResponse = {
      success: false,
      statusCode: 404,
      message: 'User not found',
      data: null,
      meta: null,
    };

    return res.status(404).json(response);
  }

  const isPasswordMatched = await bcrypt.compare(current_password, user.data.password);

  if (!isPasswordMatched) {
    const response: IBaseResponse = {
      success: false,
      statusCode: 400,
      message: 'Invalid old password',
      data: null,
      meta: null,
    };

    return res.status(400).json(response);
  }

  const hashedPassword = await bcrypt.hash(new_password, 12);

  const updateResult = await SupabaseAdapter.update<IUser>(supabaseBrowserClient, Database.users, payload.user.id, {
    password: hashedPassword,
  });

  if (!updateResult.success) {
    const response: IBaseResponse = {
      success: false,
      statusCode: 500,
      message: 'Failed to update password',
      data: null,
      meta: null,
    };

    return res.status(500).json(response);
  }

  const response: IBaseResponse = {
    success: true,
    statusCode: 200,
    message: 'Password changed successfully',
    data: null,
    meta: null,
  };

  return res.status(200).json(response);
}
