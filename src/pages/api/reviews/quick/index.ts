import { IBaseResponse } from '@base/interfaces';
import { supabaseServiceClient } from '@lib/config/supabase/serviceClient';
import { Database } from '@lib/constant/database';
import { buildSelectionFn, SupabaseAdapter } from '@lib/utils/supabaseAdapter';
import { validate } from '@lib/utils/yup';
import { reviewQuickFilterSchema, TReviewQuickFilterDto } from '@modules/reviews/lib/dtos';
import { IReview } from '@modules/reviews/lib/interfaces';
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
  const { success, data, ...restProps } = await validate<TReviewQuickFilterDto>(reviewQuickFilterSchema, req.query);

  if (!success) return res.status(400).json({ success, data, ...restProps });

  const newFilters: any = { ...data, is_active: true };

  try {
    const result = await SupabaseAdapter.find<IReview>(supabaseServiceClient, Database.reviews, newFilters, {
      selection: buildSelectionFn({
        relations: {
          user: {
            table: Database.users,
            columns: [
              'id',
              'name',
              // 'phone', 'email'
            ],
          },
          product: {
            table: Database.products,
          },
        },
        filters: newFilters,
      }),
    });

    if (!result.success) {
      const response: IBaseResponse<[]> = {
        success: false,
        statusCode: result.statusCode || 400,
        message: 'Failed to fetch reviews',
        data: [],
        meta: null,
      };

      return res.status(result.statusCode || 400).json(response);
    }

    const response: IBaseResponse = {
      success: true,
      statusCode: 200,
      message: 'Reviews fetched successfully',
      data: result.data,
      meta: result.meta,
    };

    return res.status(200).json(response);
  } catch (error) {
    const response: IBaseResponse<[]> = {
      success: false,
      statusCode: 500,
      message: 'Failed to fetch reviews',
      data: [],
      meta: null,
    };

    return res.status(500).json(response);
  }
}
