import { Env } from '.environments';
import { IBaseResponse } from '@base/interfaces';
import { mailerSendFn } from '@lib/config/mailer';
import { smsSendFn } from '@lib/config/sms';
import { supabaseServiceClient } from '@lib/config/supabase/serviceClient';
import { Database } from '@lib/constant/database';
import { SupabaseAdapter } from '@lib/utils/supabaseAdapter';
import { Toolbox } from '@lib/utils/toolbox';
import { IUser } from '@modules/users/lib/interfaces';
import { NextApiRequest, NextApiResponse } from 'next';
import { generateOtpHash } from '../lib/otp';
import { handleGetSettings } from '../settings';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  switch (method) {
    case 'OPTIONS':
      return res.status(200).end();
    case 'POST':
      return handleVerifyProfileRequest(req, res);
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

async function handleVerifyProfileRequest(req: NextApiRequest, res: NextApiResponse) {
  const { phone } = req.body;

  if (!phone) {
    const response: IBaseResponse = {
      success: false,
      statusCode: 400,
      message: 'Phone number is required',
      data: null,
      meta: null,
    };

    return res.status(400).json(response);
  }

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

  if (existingUser?.data?.is_verified) {
    const response: IBaseResponse = {
      success: false,
      statusCode: 403,
      message: 'User is already verified',
      data: null,
      meta: null,
    };

    return res.status(403).json(response);
  }

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

  const otp = Toolbox.generateKey({ length: 6, type: 'numeric' });
  const hash = generateOtpHash(existingUser.data?.phone, +otp);

  if (!settings.data?.is_sms_configured) {
    if (settings.data?.is_email_configured && existingUser?.data?.email) {
      await mailerSendFn({
        from_email: settings?.data?.email?.from_email,
        from_name: settings?.data?.email?.from_name,
        to: existingUser?.data?.email,
        subject: `Password Reset for ${settings?.data?.identity?.name || Env.webTitle}`,
        html: `Your ${settings?.data?.identity?.name || Env.webTitle} verification code is: ${otp}`,
        provider: settings?.data?.email?.provider,
        apiKey: settings?.data?.email?.api_key,
        host: settings?.data?.email?.host,
        port: settings?.data?.email?.port,
        secure: settings?.data?.email?.is_secure,
        username: settings?.data?.email?.username,
        pass: settings?.data?.email?.password,
        region: settings?.data?.email?.region,
      });

      const response: IBaseResponse = {
        success: true,
        statusCode: 201,
        message: `An OTP has been sent to ${existingUser?.data?.email}. Please check your email.`,
        data: {
          email: existingUser?.data?.email,
          hash,
          otp: Env.isProduction ? null : +otp,
        },
        meta: null,
      };

      return res.status(201).json(response);
    }

    const response: IBaseResponse = {
      success: false,
      statusCode: 500,
      message: 'Your account is not properly configured to receive OTPs. Please contact support.',
      data: null,
      meta: null,
    };

    return res.status(500).json(response);
  }

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
    to: existingUser?.data?.phone,
    message,
  });

  const response: IBaseResponse = {
    success: true,
    statusCode: 201,
    message: `An OTP has been sent to ${existingUser?.data?.phone}. Please check your message.`,
    data: {
      phone: existingUser?.data?.phone,
      hash,
      otp: Env.isProduction ? null : +otp,
    },
    meta: null,
  };

  return res.status(201).json(response);
}
