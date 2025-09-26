import { IBaseResponse } from '@base/interfaces';
import { s3, s3FileUpload } from '@lib/config/s3';
import { supabaseServiceClient } from '@lib/config/supabase/serviceClient';
import { Database } from '@lib/constant/database';
import { SupabaseAdapter } from '@lib/utils/supabaseAdapter';
import { Toolbox } from '@lib/utils/toolbox';
import { validate } from '@lib/utils/yup';
import { getServerAuthSession } from '@modules/auth/lib/utils/server';
import { ISettings } from '@modules/settings/lib/interfaces';
import formidable from 'formidable';
import fs from 'fs/promises';
import { NextApiRequest, NextApiResponse } from 'next';
import { TUploadDto, uploadSchema } from '../lib/dtos';
import { optimizeImageFn } from '../lib/utils';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

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

  switch (method) {
    case 'POST':
      return handleCreate(req, res);
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

async function handleCreate(req: NextApiRequest, res: NextApiResponse) {
  const form = formidable({ multiples: true });
  const [fields, files] = await form.parse(req);

  const { make_public } = fields;
  const purifiedMakePublic = make_public?.[0] || 'false';
  const purifiedFiles = Array.isArray(files.files) ? files.files : ([files.files].filter(Boolean) as formidable.File[]);

  const { success, data, ...restProps } = await validate<TUploadDto>(uploadSchema, {
    make_public: purifiedMakePublic,
    files: purifiedFiles,
  });

  if (!success) return res.status(400).json({ success, data, ...restProps });

  const { files: sanitizedFiles } = data;
  const urls = [];

  try {
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

    const { access_key_id, secret_access_key, endpoint, r2_worker_endpoint, bucket, region } = settings.s3;
    const s3Client = s3(access_key_id, secret_access_key, endpoint, region);

    await Promise.all(
      sanitizedFiles.map(async (sanitizedFile) => {
        let fileExt = sanitizedFile?.originalFilename?.split('.')?.pop();
        fileExt = fileExt ? '.' + fileExt : '';
        const fileName = Toolbox.generateKey({ length: 18 }) + fileExt;
        const buffer = await fs.readFile(sanitizedFile.filepath);

        const optimizedFileBuffer = await optimizeImageFn(buffer);
        const item = await s3FileUpload({
          file: optimizedFileBuffer,
          fileName,
          contentType: sanitizedFile.mimetype,
          makePublic: purifiedMakePublic === 'true',
          bucket,
          endpoint,
          r2WorkerEndpoint: r2_worker_endpoint,
          s3Client,
        });

        urls.push(item.data.fileUrl);
      }),
    );

    const response: IBaseResponse = {
      success: true,
      statusCode: 201,
      message: 'Files uploaded successfully',
      data: urls,
      meta: null,
    };

    return res.status(201).json(response);
  } catch (error) {
    const response: IBaseResponse = {
      success: false,
      statusCode: 500,
      message: 'Files upload failed',
      data: null,
      meta: null,
    };

    return res.status(500).json(response);
  }
}
