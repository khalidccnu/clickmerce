import { IBaseResponse, TId } from '@base/interfaces';
import { createSupabaseServerClient } from '@lib/config/supabase/serverClient';
import { Database } from '@lib/constant/database';
import { SupabaseAdapter } from '@lib/utils/supabaseAdapter';
import { Toolbox } from '@lib/utils/toolbox';
import { validate } from '@lib/utils/yup';
import { getServerAuthSession } from '@modules/auth/lib/utils/server';
import { settingsUpdateSchema, TSettingsUpdateDto } from '@modules/settings/lib/dtos';
import { ISettings } from '@modules/settings/lib/interfaces';
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

  let { identity, s3, vat, tax } = data;

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
      const purifiedS3 = {
        access_key_id: s3?.access_key_id || null,
        secret_access_key: s3?.secret_access_key || null,
        endpoint: s3?.endpoint || null,
        r2_worker_endpoint: s3?.r2_worker_endpoint || null,
        region: s3?.region || null,
        bucket: s3?.bucket || null,
      };

      s3 = purifiedS3;
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

    const updateResult = await SupabaseAdapter.update<ISettings>(supabaseServerClient, Database.settings, id, {
      identity,
      s3,
      vat,
      tax,
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

    const { s3: s3Config, ...safeSettings } = updateResult.data;
    const isS3Configured = Toolbox.hasAllPropsInObject(s3Config, null, ['r2_worker_endpoint']);

    const response: IBaseResponse = {
      success: true,
      statusCode: 200,
      message: 'Settings updated successfully',
      data: { ...safeSettings, is_s3_configured: isS3Configured },
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
