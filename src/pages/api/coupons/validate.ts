import { IBaseResponse } from '@base/interfaces';
import { supabaseServiceClient } from '@lib/config/supabase/serviceClient';
import { Database } from '@lib/constant/database';
import { buildSelectionFn, SupabaseAdapter } from '@lib/utils/supabaseAdapter';
import { validate } from '@lib/utils/yup';
import { couponValidateSchema, TCouponValidateDto } from '@modules/coupons/lib/dtos';
import { ENUM_COUPON_TYPES } from '@modules/coupons/lib/enums';
import { ICoupon } from '@modules/coupons/lib/interfaces';
import { ENUM_PRODUCT_DISCOUNT_TYPES } from '@modules/products/lib/enums';
import { IProduct } from '@modules/products/lib/interfaces';
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

  const { code, products } = data;

  try {
    const result = await SupabaseAdapter.findOne<ICoupon>(supabaseServiceClient, Database.coupons, {
      textFilters: { conditions: { code: { eq: code } } },
      booleanFilters: { conditions: { is_active: { eq: true } } },
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

    let sub_total_amount = 0;
    let total_cost_amount = 0;

    for (const orderProduct of products) {
      const { id: product_id, variation_id, selected_quantity } = orderProduct;

      const productResponse = await SupabaseAdapter.findOne<IProduct>(
        supabaseServiceClient,
        Database.products,
        { textFilters: { conditions: { id: { eq: product_id } } } },
        {
          selection: buildSelectionFn({
            relations: {
              variations: { table: Database.productVariations },
            },
          }),
        },
      );

      if (!productResponse.success || !productResponse.data) {
        const response: IBaseResponse = {
          success: false,
          statusCode: 404,
          message: 'Product synchronization failed',
          data: null,
          meta: null,
        };

        return res.status(404).json(response);
      }

      const product = productResponse.data;
      const variation = product.variations.find((variation) => variation.id === variation_id);

      if (!variation) {
        const response: IBaseResponse = {
          success: false,
          statusCode: 404,
          message: 'Product synchronization failed',
          data: null,
          meta: null,
        };

        return res.status(404).json(response);
      }

      if (variation.quantity < selected_quantity) {
        const response: IBaseResponse = {
          success: false,
          statusCode: 404,
          message: 'Product synchronization failed',
          data: null,
          meta: null,
        };

        return res.status(404).json(response);
      }

      let discountPrice = 0;
      const discount = variation?.discount;

      if (discount && discount.amount) {
        if (discount.type === ENUM_PRODUCT_DISCOUNT_TYPES.FIXED) {
          discountPrice = Math.max(variation.cost_price, variation.sale_price - discount.amount);
        } else if (discount.type === ENUM_PRODUCT_DISCOUNT_TYPES.PERCENTAGE) {
          const profit = variation.sale_price - variation.cost_price;
          discountPrice = variation.cost_price + profit * (1 - discount.amount / 100);
        }
      }

      const variationCostPrice = variation.cost_price * selected_quantity;
      const variationSalePrice = variation.sale_price * selected_quantity;
      const variationDiscountPrice = discountPrice * selected_quantity;

      total_cost_amount += variationCostPrice;
      sub_total_amount += variationDiscountPrice || variationSalePrice;
    }

    const profit = sub_total_amount - total_cost_amount;
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

    if (coupon.min_purchase_amount && sub_total_amount < coupon.min_purchase_amount) {
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
      discount = (sub_total_amount * coupon.amount) / 100;
    }

    if (coupon.max_redeemable_amount && discount > coupon.max_redeemable_amount) {
      discount = coupon.max_redeemable_amount;
    }

    if (discount > profit) {
      const response: IBaseResponse = {
        success: false,
        statusCode: 400,
        message: 'Coupon exceeds allowable limit',
        data: null,
        meta: null,
      };

      return res.status(400).json(response);
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
