import { IBaseResponse, TId } from '@base/interfaces';
import { supabaseServiceClient } from '@lib/config/supabase/serviceClient';
import { Database } from '@lib/constant/database';
import { buildSelectionFn, SupabaseAdapter } from '@lib/utils/supabaseAdapter';
import { productSalePriceWithDiscountFn } from '@modules/orders/lib/utils';
import { IProduct } from '@modules/products/lib/interfaces';
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
  const { slug }: { slug?: TId } = req.query;

  if (!slug) {
    const response: IBaseResponse = {
      success: false,
      statusCode: 400,
      message: 'Missing required slug parameter',
      data: null,
      meta: null,
    };

    return res.status(400).json(response);
  }

  try {
    const result = await SupabaseAdapter.findOne<IProduct>(
      supabaseServiceClient,
      Database.products,
      { textFilters: { conditions: { slug: { eq: slug as string } } } },
      {
        selection: buildSelectionFn({
          relations: {
            dosage_form: { table: Database.dosageForms },
            generic: { table: Database.generics },
            supplier: { table: Database.suppliers, columns: ['id', 'name'] },
            variations: { table: Database.productVariations },
            categories: { table: Database.productCategories, nested: { category: { table: Database.categories } } },
          },
          filters: { slug: { eq: slug as string } },
        }),
      },
    );

    if (!result.success || !result.data) {
      const response: IBaseResponse = {
        success: false,
        statusCode: 404,
        message: 'Product not found',
        data: null,
        meta: null,
      };

      return res.status(404).json(response);
    }

    let productWithSpecialPrice = 0;

    result.data?.variations?.map((variation) => {
      const specialPrice = productSalePriceWithDiscountFn(
        variation?.cost_price,
        variation?.sale_price,
        variation.discount,
      );

      if (specialPrice) productWithSpecialPrice++;

      variation.sale_discount_price = specialPrice;
      delete variation.cost_price;

      return variation;
    });

    result.data['has_sale_discount_price'] = !!productWithSpecialPrice;

    const response: IBaseResponse<IProduct> = {
      success: true,
      statusCode: 200,
      message: 'Product fetched successfully',
      data: result.data,
      meta: null,
    };

    return res.status(200).json(response);
  } catch (error) {
    const response: IBaseResponse = {
      success: false,
      statusCode: 500,
      message: 'Failed to fetch product',
      data: null,
      meta: null,
    };

    return res.status(500).json(response);
  }
}
