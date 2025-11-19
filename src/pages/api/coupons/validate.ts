import { IBaseResponse } from '@base/interfaces';
import { supabaseServiceClient } from '@lib/config/supabase/serviceClient';
import { Database } from '@lib/constant/database';
import { SupabaseAdapter } from '@lib/utils/supabaseAdapter';
import { validate } from '@lib/utils/yup';
import { couponValidateSchema, TCouponValidateDto } from '@modules/coupons/lib/dtos';
import { ENUM_COUPON_TYPES } from '@modules/coupons/lib/enums';
import { ICoupon } from '@modules/coupons/lib/interfaces';
import dayjs from 'dayjs';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  switch (method) {
    case 'OPTIONS':
      return res.status(200).end();
    case 'POST':
      return handleValidate(req, res);
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

async function handleValidate(req: NextApiRequest, res: NextApiResponse) {
  const { success, data, ...restProps } = await validate<TCouponValidateDto>(couponValidateSchema, req.body);

  if (!success) return res.status(400).json({ success, data, ...restProps });

  const { code, subtotal } = data;

  try {
    const result = await SupabaseAdapter.findOne<ICoupon>(supabaseServiceClient, Database.coupons, {
      textFilters: { conditions: { code: { eq: code } } },
    });

    if (!result.success || !result.data) {
      const response: IBaseResponse = {
        success: false,
        statusCode: 404,
        message: 'Coupon is not valid',
        data: null,
        meta: null,
      };

      return res.status(404).json(response);
    }

    const coupon = result.data;

    const now = dayjs();
    const validFrom = coupon.valid_from ? dayjs(coupon.valid_from) : null;
    const validUntil = coupon.valid_until ? dayjs(coupon.valid_until) : null;

    if (validFrom && now.isBefore(validFrom)) {
      const response: IBaseResponse = {
        success: false,
        statusCode: 400,
        message: 'Coupon is not valid at this time',
        data: null,
        meta: null,
      };

      return res.status(400).json(response);
    }

    if (validUntil && now.isAfter(validUntil)) {
      const response: IBaseResponse = {
        success: false,
        statusCode: 400,
        message: 'Coupon has expired',
        data: null,
        meta: null,
      };

      return res.status(400).json(response);
    }

    const subTotalSale = Number(subtotal || 0);

    if (coupon.min_purchase_amount && subTotalSale < coupon.min_purchase_amount) {
      const response: IBaseResponse = {
        success: false,
        statusCode: 400,
        message: 'Minimum purchase amount not met',
        data: null,
        meta: null,
      };

      return res.status(400).json(response);
    }

    if (coupon.usage_limit && coupon.usage_count >= coupon.usage_limit) {
      const response: IBaseResponse = {
        success: false,
        statusCode: 400,
        message: 'Coupon usage limit reached',
        data: null,
        meta: null,
      };

      return res.status(400).json(response);
    }

    let discount = 0;

    if (coupon.type === ENUM_COUPON_TYPES.FIXED) {
      discount = coupon.amount;
    } else {
      discount = (subTotalSale * coupon.amount) / 100;
    }

    if (coupon.max_redeemable_amount && discount > coupon.max_redeemable_amount) {
      discount = coupon.max_redeemable_amount;
    }

    const response: IBaseResponse = {
      success: true,
      statusCode: 200,
      message: 'Coupon validated successfully',
      data: {
        discount,
      },
      meta: null,
    };

    return res.status(200).json(response);
  } catch (error) {
    const response: IBaseResponse = {
      success: false,
      statusCode: 500,
      message: 'Failed to validate coupon',
      data: null,
      meta: null,
    };

    return res.status(500).json(response);
  }
}
