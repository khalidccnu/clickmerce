import { IBaseResponse, TId } from '@base/interfaces';
import { supabaseServiceClient } from '@lib/config/supabase/serviceClient';
import { Database } from '@lib/constant/database';
import { productSalePriceWithDiscountFn } from '@lib/redux/order/utils';
import { buildSelectionFn, SupabaseAdapter } from '@lib/utils/supabaseAdapter';
import { IProduct } from '@modules/products/lib/interfaces';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  switch (method) {
    case 'OPTIONS':
      return res.status(200).end();
    case 'POST':
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
  const { ids }: { ids: TId[] } = req.body;

  if (!ids || !Array.isArray(ids)) {
    const response: IBaseResponse<[]> = {
      success: false,
      statusCode: 400,
      message: 'Invalid request',
      data: [],
      meta: null,
    };

    return res.status(400).json(response);
  }

  try {
    const result = await SupabaseAdapter.findByIds<IProduct>(supabaseServiceClient, Database.products, ids, {
      selection: buildSelectionFn({
        relations: {
          dosage_form: { table: Database.dosageForms },
          generic: { table: Database.generics },
          supplier: { table: Database.suppliers, columns: ['id', 'name'] },
          variations: { table: Database.productVariations },
          categories: { table: Database.productCategories, nested: { category: { table: Database.categories } } },
        },
      }),
    });

    if (!result.success) {
      const response: IBaseResponse<[]> = {
        success: false,
        statusCode: result.statusCode || 400,
        message: 'Failed to fetch products',
        data: [],
        meta: null,
      };

      return res.status(result.statusCode || 400).json(response);
    }

    const enrichedProducts = result?.data?.map((product) => {
      let productWithSpecialPrice = 0;

      product?.variations?.map((variation) => {
        const specialPrice = productSalePriceWithDiscountFn(
          variation?.cost_price,
          variation?.sale_price,
          variation.discount,
        );

        if (specialPrice && specialPrice !== variation?.sale_price) productWithSpecialPrice++;

        variation['special_price'] = specialPrice;
        delete variation.cost_price;

        return variation;
      });

      product['has_special_price'] = !!productWithSpecialPrice;

      return product;
    });

    const response: IBaseResponse<typeof result.data> = {
      success: true,
      statusCode: 200,
      message: 'Products fetched successfully',
      data: enrichedProducts,
      meta: result.meta,
    };

    return res.status(200).json(response);
  } catch (error) {
    const response: IBaseResponse<[]> = {
      success: false,
      statusCode: 500,
      message: 'Failed to fetch products',
      data: [],
      meta: null,
    };

    return res.status(500).json(response);
  }
}
