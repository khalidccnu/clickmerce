import { IBaseResponse } from '@base/interfaces';
import { createSupabaseServerClient } from '@lib/config/supabase/serverClient';
import { Database } from '@lib/constant/database';
import { buildSelectionFn, SupabaseAdapter } from '@lib/utils/supabaseAdapter';
import { validate } from '@lib/utils/yup';
import { getServerAuthSession } from '@modules/auth/lib/utils/server';
import { orderReturnFilterSchema, TOrderReturnFilterDto } from '@modules/order-returns/lib/dtos';
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

  const { success, data, ...restProps } = await validate<TOrderReturnFilterDto>(orderReturnFilterSchema, req.query);

  if (!success) return res.status(400).json({ success, data, ...restProps });

  const { customer_id, ...restFilters } = data;
  const newFilters: any = { ...restFilters };

  if (customer_id) {
    if (!newFilters.textFilters) newFilters.textFilters = {};
    newFilters.textFilters = { conditions: { order: { customer_id: { eq: customer_id } } } };
  }

  const supabaseServerClient = createSupabaseServerClient(req, res);

  try {
    const result = await SupabaseAdapter.find<IOrderReturn>(supabaseServerClient, Database.orderReturns, newFilters, {
      selection: buildSelectionFn({
        relations: {
          order: {
            table: Database.orders,
            nested: {
              customer: { table: Database.users, foreignKey: 'customer_id', columns: ['id', 'name', 'phone', 'email'] },
            },
          },
          created_by: { table: Database.users, foreignKey: 'created_by_id', columns: ['id', 'name', 'phone', 'email'] },
        },
        filters: newFilters,
      }),
    });

    if (!result.success) {
      const response: IBaseResponse<[]> = {
        success: false,
        statusCode: result.statusCode || 400,
        message: 'Failed to fetch order returns',
        data: [],
        meta: null,
      };

      return res.status(result.statusCode || 400).json(response);
    }

    const enrichedOrderReturns = await Promise.all(
      result.data.map(async (orderReturn) => {
        if (orderReturn.products && Array.isArray(orderReturn.products)) {
          const enrichedProducts = await Promise.all(
            orderReturn.products.map(async (orderReturnProduct) => {
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

          return {
            ...orderReturn,
            products: enrichedProducts,
          };
        }

        return orderReturn;
      }),
    );

    const response: IBaseResponse<typeof enrichedOrderReturns> = {
      success: true,
      statusCode: 200,
      message: 'Order Returns fetched successfully',
      data: enrichedOrderReturns,
      meta: result.meta,
    };

    return res.status(200).json(response);
  } catch (error) {
    const response: IBaseResponse<[]> = {
      success: false,
      statusCode: 500,
      message: 'Failed to fetch order returns',
      data: [],
      meta: null,
    };

    return res.status(500).json(response);
  }
}
