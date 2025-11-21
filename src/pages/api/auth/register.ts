import { Env } from '.environments';
import { IBaseResponse } from '@base/interfaces';
import { smsSendFn } from '@lib/config/sms';
import { supabaseServiceClient } from '@lib/config/supabase/serviceClient';
import { Database } from '@lib/constant/database';
import { SupabaseAdapter } from '@lib/utils/supabaseAdapter';
import { Toolbox } from '@lib/utils/toolbox';
import { validate } from '@lib/utils/yup';
import { registerSchema, TRegisterDto } from '@modules/auth/lib/dtos';
import { IUser } from '@modules/users/lib/interfaces';
import bcrypt from 'bcryptjs';
import { NextApiRequest, NextApiResponse } from 'next';
import { generateOtpHash } from '../lib/otp';
import { handleGetSettings } from '../settings';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  switch (method) {
    case 'OPTIONS':
      return res.status(200).end();
    case 'POST':
      return handleRegister(req, res);
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

async function handleRegister(req: NextApiRequest, res: NextApiResponse) {
  const settings = await handleGetSettings(req, res, supabaseServiceClient);

  if (!settings || !settings.data) {
    const response: IBaseResponse = {
      success: false,
      statusCode: 500,
      message: 'Failed to fetch settings',
      data: null,
      meta: null,
    };

    return res.status(500).json(response);
  }

  if (!settings.data?.identity?.is_user_registration_acceptance) {
    const response: IBaseResponse = {
      success: false,
      statusCode: 403,
      message: 'User registration is not allowed at this time.',
      data: null,
      meta: null,
    };

    return res.status(403).json(response);
  }

  const { success, data, ...restProps } = await validate<TRegisterDto>(registerSchema, req.body);

  if (!success) return res.status(400).json({ success, data, ...restProps });

  const { name, phone, email, password } = data;

  const existingUser = await SupabaseAdapter.findOne<IUser>(supabaseServiceClient, Database.users, {
    textFilters: { type: 'or', conditions: { phone: { eq: phone }, email: { eq: email } } },
  });

  if (!existingUser.success) {
    const response: IBaseResponse = {
      success: false,
      statusCode: 409,
      message: 'User registration failed',
      data: null,
      meta: null,
    };

    return res.status(409).json(response);
  }

  let createUserRes: IBaseResponse<IUser & { password: string }>;
  const hashedPassword = await bcrypt.hash(password, 12);

  if (existingUser.data?.is_system_generated) {
    createUserRes = await SupabaseAdapter.update<IUser & { password: string }>(
      supabaseServiceClient,
      Database.users,
      existingUser.data.id,
      { ...data, password: hashedPassword, is_system_generated: false },
    );
  } else {
    if (existingUser.data) {
      const response: IBaseResponse = {
        success: false,
        statusCode: 409,
        message: 'User already exists',
        data: null,
        meta: null,
      };

      return res.status(409).json(response);
    }

    createUserRes = await SupabaseAdapter.create<IUser & { password: string }>(supabaseServiceClient, Database.users, {
      name,
      phone,
      email,
      password: hashedPassword,
    });
  }

  if (!createUserRes.success || !createUserRes.data) {
    const response: IBaseResponse = {
      success: false,
      statusCode: 500,
      message: 'Failed to create user',
      data: null,
      meta: null,
    };

    return res.status(500).json(response);
  }

  if (!settings.data?.identity?.need_user_registration_verification || !settings.data?.is_sms_configured) {
    const response: IBaseResponse = {
      success: true,
      statusCode: 201,
      message: 'User registered successfully',
      data: null,
      meta: null,
    };

    return res.status(201).json(response);
  }

  const otp = Toolbox.generateKey({ length: 6, type: 'numeric' });
  const hash = generateOtpHash(createUserRes.data?.phone, +otp);

  const message = `Your ${settings?.data?.identity?.name || Env.webTitle} verification code is: ${otp}`;

  await smsSendFn({
    provider: settings?.data?.sms?.provider,
    accountSid: settings?.data?.sms?.account_sid,
    apiKey: settings?.data?.sms?.api_key,
    apiSecret: settings?.data?.sms?.api_secret,
    authToken: settings?.data?.sms?.auth_token,
    endpoint: settings?.data?.sms?.endpoint,
    region: settings?.data?.sms?.region,
    senderId: settings?.data?.sms?.sender_id,
    to: createUserRes.data?.phone,
    message,
  });

  const response: IBaseResponse = {
    success: true,
    statusCode: 201,
    message: `An OTP has been sent to ${createUserRes.data?.phone}. Please check your message.`,
    data: {
      phone: createUserRes.data?.phone,
      hash,
      otp: Env.isProduction ? null : +otp,
    },
    meta: null,
  };

  return res.status(201).json(response);
}
