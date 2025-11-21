import { IBaseResponse, TId } from '@base/interfaces';
import { supabaseServiceClient } from '@lib/config/supabase/serviceClient';
import { Database } from '@lib/constant/database';
import { buildSelectionFn, SupabaseAdapter } from '@lib/utils/supabaseAdapter';
import { IOrder } from '@modules/orders/lib/interfaces';
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

  try {
    const result = await SupabaseAdapter.findOne<IOrder>(
      supabaseServiceClient,
      Database.orders,
      { textFilters: { conditions: { id: { eq: id as string } } } },
      {
        selection: buildSelectionFn({
          relations: {
            customer: {
              table: Database.users,
              foreignKey: 'customer_id',
              columns: ['id', 'name', 'phone', 'email'],
            },
            payment_method: { table: Database.paymentMethods, foreignKey: 'payment_method_id' },
            delivery_zone: {
              table: Database.deliveryZones,
              foreignKey: 'delivery_zone_id',
              nested: { delivery_service_type: { table: Database.deliveryServiceTypes } },
            },
          },
          filters: { id: { eq: id as string } },
        }),
      },
    );

    if (!result.success || !result.data) {
      const response: IBaseResponse = {
        success: false,
        statusCode: 404,
        message: 'Order not found',
        data: null,
        meta: null,
      };

      return res.status(404).json(response);
    }

    let enrichedOrder = result.data;

    if (enrichedOrder && enrichedOrder.products && Array.isArray(enrichedOrder.products)) {
      const enrichedProducts = await Promise.all(
        enrichedOrder.products.map(async (orderProduct) => {
          if (orderProduct?.variations?.length) {
            orderProduct.variations = orderProduct.variations.map((variation) => {
              delete variation.cost_price;
              return variation;
            });
          }

          try {
            const currentProductResponse = await SupabaseAdapter.findOne<IProduct>(
              supabaseServiceClient,
              Database.products,
              {
                textFilters: {
                  conditions: { id: { eq: orderProduct.id as string } },
                },
              },
              {
                selection: buildSelectionFn({
                  relations: {
                    dosage_form: { table: Database.dosageForms },
                    generic: { table: Database.generics },
                    supplier: { table: Database.suppliers, columns: ['id', 'name'] },
                    variations: { table: Database.productVariations },
                    categories: {
                      table: Database.productCategories,
                      nested: { category: { table: Database.categories } },
                    },
                  },
                }),
              },
            );

            const currentInfo = currentProductResponse.success ? currentProductResponse.data : null;

            if (currentInfo?.variations?.length) {
              let productWithSpecialPrice = 0;

              currentInfo.variations = currentInfo.variations.map((variation) => {
                const specialPrice = productSalePriceWithDiscountFn(
                  variation.cost_price,
                  variation.sale_price,
                  variation.discount,
                );

                if (specialPrice && specialPrice !== variation.sale_price) {
                  productWithSpecialPrice++;
                }

                delete variation.cost_price;

                return {
                  ...variation,
                  sale_discount_price: specialPrice,
                };
              });

              currentInfo['has_sale_discount_price'] = !!productWithSpecialPrice;
            }

            return {
              ...orderProduct,
              current_info: currentInfo,
            };
          } catch (error) {
            return {
              ...orderProduct,
              current_info: null,
            };
          }
        }),
      );

      enrichedOrder = {
        ...enrichedOrder,
        products: enrichedProducts,
      };
    }

    const response: IBaseResponse<IOrder> = {
      success: true,
      statusCode: 200,
      message: 'Order fetched successfully',
      data: enrichedOrder,
      meta: null,
    };

    return res.status(200).json(response);
  } catch (error) {
    const response: IBaseResponse = {
      success: false,
      statusCode: 500,
      message: 'Failed to fetch order',
      data: null,
      meta: null,
    };

    return res.status(500).json(response);
  }
}
