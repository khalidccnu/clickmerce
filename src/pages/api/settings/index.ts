import { IBaseResponse } from '@base/interfaces';
import { createSupabaseServerClient } from '@lib/config/supabase/serverClient';
import { Database } from '@lib/constant/database';
import { SupabaseAdapter } from '@lib/utils/supabaseAdapter';
import { Toolbox } from '@lib/utils/toolbox';
import { getServerAuthSession } from '@modules/auth/lib/utils/server';
import { ISettings } from '@modules/settings/lib/interfaces';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  switch (method) {
    case 'OPTIONS':
      return res.status(200).end();
    case 'GET':
      return handleGet(req, res);
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

async function handleGet(req: NextApiRequest, res: NextApiResponse) {
  const { token } = getServerAuthSession(req);

  const supabaseServerClient = createSupabaseServerClient(req, res);

  try {
    const result = await SupabaseAdapter.find<ISettings>(
      supabaseServerClient,
      token ? Database.settings : Database.settings_view,
    );

    if (!result.success) {
      const response: IBaseResponse = {
        success: false,
        statusCode: result.statusCode || 400,
        message: 'Failed to fetch settings',
        data: null,
        meta: null,
      };

      return res.status(result.statusCode || 400).json(response);
    }

    if (!token) {
      const response: IBaseResponse = {
        success: true,
        statusCode: 200,
        message: 'Settings fetched successfully',
        data: result.data?.[0] || null,
        meta: result.meta,
      };

      return res.status(200).json(response);
    }

    const { s3, ...safeSettings } = result.data?.[0];
    const isS3Configured = Toolbox.hasAllPropsInObject(s3, null, ['custom_url']);

    const response: IBaseResponse = {
      success: true,
      statusCode: 200,
      message: 'Settings fetched successfully',
      data: { ...safeSettings, is_s3_configured: isS3Configured },
      meta: result.meta,
    };

    return res.status(200).json(response);
  } catch (error) {
    const response: IBaseResponse = {
      success: false,
      statusCode: 500,
      message: 'Failed to fetch settings',
      data: null,
      meta: null,
    };

    return res.status(500).json(response);
  }
}
