import { IBaseResponse, TId } from '@base/interfaces';
import { createSupabaseServerClient } from '@lib/config/supabase/serverClient';
import { Database } from '@lib/constant/database';
import { SupabaseAdapter } from '@lib/utils/supabaseAdapter';
import { Toolbox } from '@lib/utils/toolbox';
import { validate } from '@lib/utils/yup';
import { getServerAuthSession } from '@modules/auth/lib/utils/server';
import { settingsUpdateSchema, TSettingsUpdateDto } from '@modules/settings/lib/dtos';
import { ISettings } from '@modules/settings/lib/interfaces';
import { requiredSettingsEmailFieldsFn, requiredSettingsSmsFieldsFn } from '@modules/settings/lib/utils';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  switch (method) {
    case 'OPTIONS':
      return res.status(200).end();
    case 'PATCH':
      return handleUpdate(req, res);
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

async function handleUpdate(req: NextApiRequest, res: NextApiResponse) {
  const { id }: { id?: TId } = req.query;

  if (!id) {
    const response: IBaseResponse = {
      success: false,
      statusCode: 400,
      message: 'Missing required id parameter',
      data: null,
      meta: null,
    };

    return res.status(400).json(response);
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

  const { success, data, ...restProps } = await validate<TSettingsUpdateDto>(settingsUpdateSchema, req.body);

  if (!success) return res.status(400).json({ success, data, ...restProps });

  let { identity, s3, vat, tax, email, sms } = data;

  const supabaseServerClient = createSupabaseServerClient(req, res);

  try {
    const existingSettings = await SupabaseAdapter.findById<ISettings>(supabaseServerClient, Database.settings, id);

    if (!existingSettings.success) {
      const response: IBaseResponse = {
        success: false,
        statusCode: 404,
        message: 'Settings do not exist',
        data: null,
        meta: null,
      };

      return res.status(404).json(response);
    }

    if (identity) {
      identity = {
        ...existingSettings.data?.identity,
        ...identity,
      };
    }

    if (s3) {
      s3 = { ...existingSettings.data?.s3, ...s3 };
    }

    if (vat) {
      vat = {
        ...existingSettings.data?.vat,
        ...vat,
      };
    }

    if (tax) {
      tax = {
        ...existingSettings.data?.tax,
        ...tax,
      };
    }

    if (email) {
      email = {
        ...existingSettings.data?.email,
        ...email,
      };
    }

    if (sms) {
      sms = {
        ...existingSettings.data?.sms,
        ...sms,
      };
    }

    const updateResult = await SupabaseAdapter.update<ISettings>(supabaseServerClient, Database.settings, id, {
      identity,
      s3,
      vat,
      tax,
      email,
      sms,
    });

    if (!updateResult.success) {
      const response: IBaseResponse = {
        success: false,
        statusCode: updateResult.statusCode || 400,
        message: 'Settings update failed',
        data: null,
        meta: null,
      };

      return res.status(updateResult.statusCode || 400).json(response);
    }

    const { s3: s3Config, ...restSettings } = updateResult.data;
    const isS3Configured = Toolbox.hasAllPropsInObject(s3Config, null, ['custom_url']);
    const requiredEmailFields = requiredSettingsEmailFieldsFn(email?.provider);
    const isEmailConfigured = Toolbox.isEmpty(requiredEmailFields)
      ? false
      : Toolbox.hasAllPropsInObject(email, requiredEmailFields);

    const requiredSmsFields = requiredSettingsSmsFieldsFn(sms?.provider);
    const isSmsConfigured = Toolbox.isEmpty(requiredSmsFields)
      ? false
      : Toolbox.hasAllPropsInObject(sms, requiredSmsFields);

    const response: IBaseResponse = {
      success: true,
      statusCode: 200,
      message: 'Settings updated successfully',
      data: {
        ...restSettings,
        is_s3_configured: isS3Configured,
        is_email_configured: isEmailConfigured,
        is_sms_configured: isSmsConfigured,
        s3: s3Config,
        email,
        sms,
      },
      meta: null,
    };

    return res.status(200).json(response);
  } catch (error) {
    const response: IBaseResponse = {
      success: false,
      statusCode: 500,
      message: 'Settings update failed',
      data: null,
      meta: null,
    };

    return res.status(500).json(response);
  }
}
