import { IBaseResponse } from '@base/interfaces';
import { supabaseServiceClient } from '@lib/config/supabase/serviceClient';
import { Database } from '@lib/constant/database';
import { SupabaseAdapter } from '@lib/utils/supabaseAdapter';
import { validate } from '@lib/utils/yup';
import { galleryQuickCreateSchema, TGalleryQuickCreateDto } from '@modules/galleries/lib/dtos';
import { IGallery } from '@modules/galleries/lib/interfaces';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  switch (method) {
    case 'OPTIONS':
      return res.status(200).end();
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
  const { success, data, ...restProps } = await validate<TGalleryQuickCreateDto>(galleryQuickCreateSchema, req.body);

  if (!success) return res.status(400).json({ success, data, ...restProps });

  try {
    const response = await SupabaseAdapter.batchCreate<IGallery>(supabaseServiceClient, Database.galleries, data.items);

    return res.status(201).json(response);
  } catch (error) {
    const response: IBaseResponse = {
      success: false,
      statusCode: 500,
      message: error.message || 'Failed to create gallery',
      data: null,
      meta: null,
    };

    return res.status(500).json(response);
  }
}
