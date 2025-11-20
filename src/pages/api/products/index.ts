import { IBaseResponse } from '@base/interfaces';
import { supabaseServiceClient } from '@lib/config/supabase/serviceClient';
import { Database } from '@lib/constant/database';
import { productSalePriceWithDiscountFn } from '@lib/redux/order/utils';
import { buildSelectionFn, SupabaseAdapter } from '@lib/utils/supabaseAdapter';
import { Toolbox } from '@lib/utils/toolbox';
import { validate } from '@lib/utils/yup';
import { productFilterSchema, TProductFilterDto } from '@modules/products/lib/dtos';
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
  const { success, data, ...restProps } = await validate<TProductFilterDto>(productFilterSchema, req.query);

  if (!success) return res.status(400).json({ success, data, ...restProps });

  const { category_id, is_low_stock, ...restFilters } = data;
  const newFilters: any = { ...restFilters };

  if (is_low_stock) {
    if (!newFilters.numericFilters) newFilters.numericFilters = {};

    if (Toolbox.toBool(is_low_stock)) {
      newFilters.numericFilters = {
        conditions: {
          quantity: { lte: 24 },
        },
      };
    } else {
      newFilters.numericFilters = {
        conditions: {
          quantity: { gt: 24 },
        },
      };
    }
  }

  if (category_id) {
    if (!newFilters.textFilters) newFilters.textFilters = {};
    newFilters.textFilters = { conditions: { categories: { category_id: { eq: category_id } } } };
  }

  // if (is_special) {
  //   if (!newFilters.numericFilters) newFilters.numericFilters = {};

  //   if (Toolbox.toBool(is_special)) {
  //     newFilters.numericFilters = {
  //       conditions: {
  //         variations: {
  //           discount: {
  //             amount: { gt: 0 },
  //           },
  //         },
  //       },
  //     };
  //   } else {
  //     newFilters.numericFilters = {
  //       conditions: {
  //         variations: {
  //           discount: {
  //             amount: { lte: 0 },
  //           },
  //         },
  //       },
  //     };
  //   }
  // }

  try {
    const result = await SupabaseAdapter.find<IProduct>(supabaseServiceClient, Database.products, newFilters, {
      selection: buildSelectionFn({
        relations: {
          dosage_form: { table: Database.dosageForms },
          generic: { table: Database.generics },
          supplier: { table: Database.suppliers, columns: ['id', 'name'] },
          variations: { table: Database.productVariations },
          categories: { table: Database.productCategories, nested: { category: { table: Database.categories } } },
        },
        filters: newFilters,
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

        variation['sale_discount_price'] = specialPrice;
        delete variation.cost_price;

        return variation;
      });

      product['has_sale_discount_price'] = !!productWithSpecialPrice;

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
