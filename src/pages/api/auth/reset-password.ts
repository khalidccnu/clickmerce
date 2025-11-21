import { IBaseResponse } from '@base/interfaces';
import { supabaseServiceClient } from '@lib/config/supabase/serviceClient';
import { Database } from '@lib/constant/database';
import { SupabaseAdapter } from '@lib/utils/supabaseAdapter';
import { validate } from '@lib/utils/yup';
import { passwordResetSchema, TPasswordResetDto } from '@modules/auth/lib/dtos';
import { IUser } from '@modules/users/lib/interfaces';
import bcrypt from 'bcryptjs';
import { NextApiRequest, NextApiResponse } from 'next';
import { verifyOtpHash } from '../lib/otp';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  switch (method) {
    case 'OPTIONS':
      return res.status(200).end();
    case 'PATCH':
      return handleResetPassword(req, res);
    default:
      const response: IBaseResponse = {
        success: false,
        statusCode: 405,
        message: 'Method not allowed',
        data: null,
        meta: null,
      };

      return res.status(405).json(response);
  }
}

async function handleResetPassword(req: NextApiRequest, res: NextApiResponse) {
  const { success, data, ...restProps } = await validate<TPasswordResetDto>(passwordResetSchema, req.body);

  if (!success) return res.status(400).json({ success, data, ...restProps });

  const { phone, otp, hash, new_password } = data;

  const existingUser = await SupabaseAdapter.findOne<IUser>(supabaseServiceClient, Database.users, {
    textFilters: { conditions: { phone: { eq: phone } } },
    booleanFilters: { conditions: { is_system_generated: { eq: false } } },
  });

  if (existingUser.success && !existingUser.data) {
    const response: IBaseResponse = {
      success: false,
      statusCode: 404,
      message: 'User does not exist',
      data: null,
      meta: null,
    };

    return res.status(404).json(response);
  }

  if (!existingUser?.data?.is_verified) {
    const response: IBaseResponse = {
      success: false,
      statusCode: 403,
      message: 'User is not verified',
      data: null,
      meta: null,
    };

    return res.status(403).json(response);
  }

  const isValidOtp = verifyOtpHash(phone, otp, hash);

  if (!isValidOtp) {
    const response: IBaseResponse = {
      success: false,
      statusCode: 400,
      message: 'Invalid or expired OTP',
      data: null,
      meta: null,
    };

    return res.status(400).json(response);
  }

  const hashedPassword = await bcrypt.hash(new_password, 10);

  const updateUserRes = await SupabaseAdapter.update<IUser>(
    supabaseServiceClient,
    Database.users,
    existingUser.data?.id,
    { password: hashedPassword },
  );

  if (!updateUserRes.success) {
    const response: IBaseResponse = {
      success: false,
      statusCode: 500,
      message: 'Failed to reset password',
      data: null,
      meta: null,
    };

    return res.status(500).json(response);
  }

  const response: IBaseResponse = {
    success: true,
    statusCode: 201,
    message: `Password has been reset successfully for ${existingUser.data?.phone}.`,
    data: null,
    meta: null,
  };

  return res.status(201).json(response);
}
