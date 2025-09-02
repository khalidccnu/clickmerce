import { IBaseResponse } from '@base/interfaces';
import { createSupabaseServerClient } from '@lib/config/supabase/serverClient';
import { Database } from '@lib/constant/database';
import { SupabaseAdapter } from '@lib/utils/supabaseAdapter';
import { validate } from '@lib/utils/yup';
import { changePasswordSchema, TChangePasswordDto } from '@modules/auth/lib/dtos';
import { getServerAuthSession } from '@modules/auth/lib/utils/server';
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

  const { token } = getServerAuthSession(req);

  if (!token) {
    const response: IBaseResponse = {
      success: false,
      statusCode: 401,
      message: 'Unauthorized',
      data: null,
      meta: null,
    };

    return res.status(401).json(response);
  }

  const { success, data, ...restProps } = await validate<TChangePasswordDto>(changePasswordSchema, req.body);

  if (!success) return res.status(400).json({ success, data, ...restProps });

  const { current_password, new_password } = data;

  const payload = jwtVerify(token);

  if (!payload.user.id) {
    const response: IBaseResponse = {
      success: false,
      statusCode: 400,
      message: 'Missing current password or new password',
      data: null,
      meta: null,
    };

    return res.status(400).json(response);
  }

  const supabaseServerClient = createSupabaseServerClient(req, res);

  const user = await SupabaseAdapter.findById<IUser & { password: string }>(
    supabaseServerClient,
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

  const updateResult = await SupabaseAdapter.update<IUser>(supabaseServerClient, Database.users, payload.user.id, {
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
