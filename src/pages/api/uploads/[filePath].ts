import { IBaseResponse } from '@base/interfaces';
import { s3, s3FileDelete } from '@lib/config/s3';
import { supabaseServiceClient } from '@lib/config/supabase/serviceClient';
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
    case 'DELETE':
      return handleDelete(req, res);
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

async function handleDelete(req: NextApiRequest, res: NextApiResponse) {
  const { filePath }: { filePath?: string } = req.query;

  if (!filePath) {
    const response: IBaseResponse = {
      success: false,
      statusCode: 400,
      message: 'Missing required file path parameter',
      data: null,
      meta: null,
    };

    return res.status(400).json(response);
  }

  const { token } = getServerAuthSession(req);

  if (!token) {
    return res.status(401).json({
      success: false,
      statusCode: 401,
      message: 'Unauthorized',
      data: null,
      meta: null,
    });
  }

  const result = await SupabaseAdapter.find<ISettings>(supabaseServiceClient, Database.settings);

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

  const settings = result.data?.[0];
  const isS3Configured = Toolbox.hasAllPropsInObject(settings.s3, null, ['r2_worker_endpoint']);

  if (!isS3Configured) {
    const response: IBaseResponse = {
      success: false,
      statusCode: 500,
      message: 'S3 configuration is incomplete',
      data: null,
      meta: null,
    };
    return res.status(500).json(response);
  }

  const { access_key_id, secret_access_key, endpoint, bucket, region } = settings.s3;
  const s3Client = s3(access_key_id, secret_access_key, endpoint, region);

  const deleteResult = await s3FileDelete({
    filePath,
    bucket,
    s3Client,
  });

  return res.status(deleteResult.statusCode).json(deleteResult);
}
