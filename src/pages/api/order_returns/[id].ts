import { IBaseResponse, TId } from '@base/interfaces';
import { createSupabaseServerClient } from '@lib/config/supabase/serverClient';
import { Database } from '@lib/constant/database';
import { buildSelectionFn, SupabaseAdapter } from '@lib/utils/supabaseAdapter';
import { getServerAuthSession } from '@modules/auth/lib/utils/server';
import { IOrderReturn } from '@modules/order-returns/lib/interfaces';
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
  const { id }: { id?: TId } = req.query;

  if (!id) {
    const response: IBaseResponse = {
      success: false,
      statusCode: 400,
      message: 'Missing required id parameter',
      data: null,
      meta: null,
    };

    return res.status(400).json(response);
  }

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

  const supabaseServerClient = createSupabaseServerClient(req, res);

  try {
    const result = await SupabaseAdapter.findOne<IOrderReturn>(
      supabaseServerClient,
      Database.orderReturns,
      { textFilters: { conditions: { id: { eq: id as string } } } },
      {
        selection: buildSelectionFn({
          relations: {
            order: {
              table: Database.orders,
              nested: { customer: { table: Database.users, foreignKey: 'customer_id' } },
            },
            created_by: { table: Database.users, foreignKey: 'created_by_id' },
          },
          filters: { id: { eq: id as string } },
        }),
      },
    );

    if (!result.success || !result.data) {
      const response: IBaseResponse = {
        success: false,
        statusCode: 404,
        message: 'Order Return not found',
        data: null,
        meta: null,
      };

      return res.status(404).json(response);
    }

    if (result.data.products && Array.isArray(result.data.products)) {
      const enrichedProducts = await Promise.all(
        result.data.products.map(async (orderReturnProduct) => {
          try {
            const currentProductResponse = await SupabaseAdapter.findOne(
              supabaseServerClient,
              Database.products,
              { textFilters: { conditions: { id: { eq: orderReturnProduct.id as string } } } },
              {
                selection: buildSelectionFn({
                  relations: {
                    dosage_form: { table: Database.dosageForms },
                    generic: { table: Database.generics },
                    supplier: { table: Database.suppliers },
                    variations: { table: Database.productVariations },
                  },
                }),
              },
            );

            return {
              ...orderReturnProduct,
              current_info: currentProductResponse.success ? currentProductResponse.data : null,
            };
          } catch (error) {
            return {
              ...orderReturnProduct,
              current_info: null,
            };
          }
        }),
      );

      result.data.products = enrichedProducts;
    }

    const response: IBaseResponse<IOrderReturn> = {
      success: true,
      statusCode: 200,
      message: 'Order Return fetched successfully',
      data: result.data,
      meta: null,
    };

    return res.status(200).json(response);
  } catch (error) {
    const response: IBaseResponse = {
      success: false,
      statusCode: 500,
      message: 'Failed to fetch order return',
      data: null,
      meta: null,
    };

    return res.status(500).json(response);
  }
}
