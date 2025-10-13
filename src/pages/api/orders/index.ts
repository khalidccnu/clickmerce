import { IBaseResponse } from '@base/interfaces';
import { createSupabaseServerClient } from '@lib/config/supabase/serverClient';
import { Database } from '@lib/constant/database';
import { buildSelectionFn, SupabaseAdapter } from '@lib/utils/supabaseAdapter';
import { validate } from '@lib/utils/yup';
import { getServerAuthSession } from '@modules/auth/lib/utils/server';
import { ICoupon } from '@modules/coupons/lib/interfaces';
import { IDeliveryZone } from '@modules/delivery-zones/lib/interfaces';
import { orderCreateSchema, orderFilterSchema, TOrderCreateDto, TOrderFilterDto } from '@modules/orders/lib/dtos';
import { ENUM_ORDER_PAYMENT_STATUS_TYPES, ENUM_ORDER_STATUS_TYPES } from '@modules/orders/lib/enums';
import { IOrder } from '@modules/orders/lib/interfaces';
import { ENUM_PRODUCT_DISCOUNT_TYPES } from '@modules/products/lib/enums';
import { IProduct } from '@modules/products/lib/interfaces';
import { ENUM_SETTINGS_TAX_TYPES } from '@modules/settings/lib/enums';
import { ISettings } from '@modules/settings/lib/interfaces';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  switch (method) {
    case 'OPTIONS':
      return res.status(200).end();
    case 'GET':
      return handleGet(req, res);
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

  const { success, data, ...restProps } = await validate<TOrderFilterDto>(orderFilterSchema, req.query);

  if (!success) return res.status(400).json({ success, data, ...restProps });

  const supabaseServerClient = createSupabaseServerClient(req, res);

  try {
    const result = await SupabaseAdapter.find<IOrder>(supabaseServerClient, Database.orders, data, {
      selection: buildSelectionFn({
        relations: {
          customer: { table: Database.users, foreignKey: 'customer_id' },
          payment_method: { table: Database.paymentMethods },
          delivery_zone: { table: Database.deliveryZones },
          created_by: { table: Database.users, foreignKey: 'created_by_id' },
          updated_by: { table: Database.users, foreignKey: 'updated_by_id' },
        },
        filters: data,
      }),
    });

    if (!result.success) {
      const response: IBaseResponse<[]> = {
        success: false,
        statusCode: result.statusCode || 400,
        message: 'Failed to fetch orders',
        data: [],
        meta: null,
      };

      return res.status(result.statusCode || 400).json(response);
    }

    const enrichedOrders = await Promise.all(
      result.data.map(async (order) => {
        if (order.products && Array.isArray(order.products)) {
          const enrichedProducts = await Promise.all(
            order.products.map(async (orderProduct) => {
              try {
                const currentProductResponse = await SupabaseAdapter.findOne(
                  supabaseServerClient,
                  Database.products,
                  { textFilters: { conditions: { id: { eq: orderProduct.id as string } } } },
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
                  ...orderProduct,
                  current_info: currentProductResponse.success ? currentProductResponse.data : null,
                };
              } catch (error) {
                return {
                  ...orderProduct,
                  current_info: null,
                };
              }
            }),
          );

          return {
            ...order,
            products: enrichedProducts,
          };
        }

        return order;
      }),
    );

    const response: IBaseResponse<typeof enrichedOrders> = {
      success: true,
      statusCode: 200,
      message: 'Orders fetched successfully',
      data: enrichedOrders,
      meta: result.meta,
    };

    return res.status(200).json(response);
  } catch (error) {
    const response: IBaseResponse<[]> = {
      success: false,
      statusCode: 500,
      message: 'Failed to fetch orders',
      data: [],
      meta: null,
    };

    return res.status(500).json(response);
  }
}

async function handleCreate(req: NextApiRequest, res: NextApiResponse) {
  const { token, user } = getServerAuthSession(req);

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

  const { success, data, ...restProps } = await validate<TOrderCreateDto>(orderCreateSchema, req.body);

  if (!success) return res.status(400).json({ success, data, ...restProps });

  const {
    code,
    products,
    redeem_amount,
    pay_amount,
    payment_method_id,
    delivery_zone_id,
    customer_id,
    coupon_id,
    is_round_off,
    ...rest
  } = data;

  const supabaseServerClient = createSupabaseServerClient(req, res);

  try {
    const operations = [];
    let sub_total_amount = 0;
    let total_cost_amount = 0;
    const allocations = [];

    for (const orderProduct of products) {
      const { id: product_id, variation_id, selected_quantity, discount } = orderProduct;

      const productResponse = await SupabaseAdapter.findOne<IProduct>(
        supabaseServerClient,
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
          message: productResponse.message || 'Product not found',
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
          message: 'Product variation not found',
          data: null,
          meta: null,
        };

        return res.status(404).json(response);
      }

      if (variation.quantity < selected_quantity) {
        const response: IBaseResponse = {
          success: false,
          statusCode: 404,
          message: 'Insufficient quantity',
          data: null,
          meta: null,
        };

        return res.status(404).json(response);
      }

      let discountPrice = variation.sale_price;

      if (discount && discount.amount) {
        if (discount.type === ENUM_PRODUCT_DISCOUNT_TYPES.FIXED) {
          discountPrice = Math.max(variation.cost_price, variation.sale_price - discount.amount);
        } else if (discount.type === ENUM_PRODUCT_DISCOUNT_TYPES.PERCENTAGE) {
          const discountAmount = (variation.sale_price * discount.amount) / 100;
          discountPrice = Math.max(variation.cost_price, variation.sale_price - discountAmount);
        }
      }

      const variationCostPrice = variation.cost_price * selected_quantity;
      const variationDiscountPrice = discountPrice * selected_quantity;

      total_cost_amount += variationCostPrice;
      sub_total_amount += variationDiscountPrice;

      allocations.push({
        product_id,
        variation_id,
        allocated_quantity: selected_quantity,
        cost_price: variation.cost_price,
        sale_price: variation.sale_price,
        sale_discount_price: discountPrice,
        discount,
        mfg: variation.mfg,
        exp: variation.exp,
        color: variation.color,
        size: variation.size,
      });

      operations.push({
        table: Database.productVariations,
        operation: variation.quantity - selected_quantity === 0 ? 'delete' : 'update',
        id: variation_id,
        data:
          variation.quantity - selected_quantity === 0
            ? undefined
            : {
                quantity: variation.quantity - selected_quantity,
              },
      });
    }

    const settingsResponse = await SupabaseAdapter.findOne<ISettings>(supabaseServerClient, Database.settings, {
      booleanFilters: { conditions: { is_active: { eq: true } } },
    });

    let vat_amount = 0;
    let tax_amount = 0;

    if (settingsResponse.success && settingsResponse.data) {
      const settings = settingsResponse.data;

      if (settings.vat?.type === ENUM_SETTINGS_TAX_TYPES.PERCENTAGE) {
        vat_amount = sub_total_amount * (settings.vat.amount / 100);
      } else {
        vat_amount = settings.vat?.amount || 0;
      }

      if (settings.tax?.type === ENUM_SETTINGS_TAX_TYPES.PERCENTAGE) {
        tax_amount = sub_total_amount * (settings.tax.amount / 100);
      } else {
        tax_amount = settings.tax?.amount || 0;
      }
    }

    const profit = sub_total_amount - total_cost_amount;
    let total_redeem = redeem_amount;

    if (total_redeem > profit) {
      total_redeem = profit;
    }

    const deliveryZoneResponse = await SupabaseAdapter.findOne<IDeliveryZone>(
      supabaseServerClient,
      Database.deliveryZones,
      {
        textFilters: { conditions: { id: { eq: delivery_zone_id } } },
      },
      {
        selection: buildSelectionFn({
          relations: {
            delivery_service_type: { table: Database.deliveryServiceTypes },
          },
          filters: { id: { eq: delivery_zone_id } },
        }),
      },
    );

    let delivery_charge = 0;

    if (deliveryZoneResponse.success && deliveryZoneResponse.data) {
      delivery_charge = deliveryZoneResponse.data.delivery_service_type?.amount || 0;
    }

    const grand_total_amount = sub_total_amount + vat_amount + tax_amount + delivery_charge - total_redeem;
    const total = is_round_off ? Math.round(grand_total_amount) : grand_total_amount;
    const due_amount = pay_amount > total ? 0 : total - pay_amount;

    const mergedProductsMap = new Map<string, any>();

    for (const allocation of allocations) {
      if (!mergedProductsMap.has(allocation.product_id)) {
        mergedProductsMap.set(allocation.product_id, {
          id: allocation.product_id,
          variations: [],
        });
      }

      const existingProduct = mergedProductsMap.get(allocation.product_id);

      existingProduct.variations.push({
        id: allocation.variation_id,
        cost_price: allocation.cost_price,
        sale_price: allocation.sale_price,
        sale_discount_price: allocation.sale_discount_price,
        discount: allocation.discount,
        quantity: allocation.allocated_quantity,
        mfg: allocation.mfg,
        exp: allocation.exp,
        color: allocation.color,
        size: allocation.size,
      });
    }

    const mergedProducts = Array.from(mergedProductsMap.values());

    const purifiedOrder = {
      ...rest,
      code,
      products: mergedProducts,
      redeem_amount: total_redeem,
      vat_amount,
      tax_amount,
      sub_total_amount,
      grand_total_amount: total,
      round_off_amount: is_round_off ? total - grand_total_amount : 0,
      pay_amount: Math.min(pay_amount, total),
      due_amount,
      delivery_charge,
      payment_status: due_amount ? ENUM_ORDER_PAYMENT_STATUS_TYPES.PARTIAL : ENUM_ORDER_PAYMENT_STATUS_TYPES.FULL,
      status: ENUM_ORDER_STATUS_TYPES.COMPLETED,
      customer_id,
      payment_method_id,
      delivery_zone_id,
      created_by_id: user.id,
    };

    const orderResponse = await SupabaseAdapter.create<IOrder>(supabaseServerClient, Database.orders, purifiedOrder);

    if (!orderResponse.success) {
      const response: IBaseResponse = {
        success: false,
        statusCode: 500,
        message: orderResponse.message || 'Failed to create order',
        data: null,
        meta: null,
      };

      return res.status(500).json(response);
    }

    for (const operation of operations) {
      if (operation.operation === 'delete') {
        await SupabaseAdapter.delete(supabaseServerClient, operation.table, operation.id);
      } else {
        await SupabaseAdapter.update(supabaseServerClient, operation.table, operation.id, operation.data);
      }
    }

    const completeOrderResponse = await SupabaseAdapter.findOne<IOrder>(
      supabaseServerClient,
      Database.orders,
      { textFilters: { conditions: { id: { eq: orderResponse.data.id as string } } } },
      {
        selection: buildSelectionFn({
          relations: {
            customer: { table: Database.users, foreignKey: 'customer_id' },
            payment_method: { table: Database.paymentMethods, foreignKey: 'payment_method_id' },
            delivery_zone: { table: Database.deliveryZones, foreignKey: 'delivery_zone_id' },
            created_by: { table: Database.users, foreignKey: 'created_by_id' },
            updated_by: { table: Database.users, foreignKey: 'updated_by_id' },
          },
          filters: { id: orderResponse.data.id as string },
        }),
      },
    );

    let enrichedOrder = completeOrderResponse.data || orderResponse.data;

    if (enrichedOrder && enrichedOrder.products && Array.isArray(enrichedOrder.products)) {
      const enrichedProducts = await Promise.all(
        enrichedOrder.products.map(async (orderProduct) => {
          try {
            const currentProductResponse = await SupabaseAdapter.findOne(
              supabaseServerClient,
              Database.products,
              { textFilters: { conditions: { id: { eq: orderProduct.id as string } } } },
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
              ...orderProduct,
              current_info: currentProductResponse.success ? currentProductResponse.data : null,
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

    if (coupon_id) {
      const { success, data } = await SupabaseAdapter.findById<ICoupon>(
        supabaseServerClient,
        Database.coupons,
        coupon_id,
      );

      const couponResponse = await SupabaseAdapter.update<ICoupon>(supabaseServerClient, Database.coupons, coupon_id, {
        usage_count: data?.usage_count + 1,
      });

      if (!success || !couponResponse.success) {
        const response: IBaseResponse = {
          success: false,
          statusCode: 500,
          message: 'Failed to update coupon usage',
          data: null,
          meta: null,
        };

        return res.status(500).json(response);
      }
    }

    const response: IBaseResponse<IOrder> = {
      success: true,
      statusCode: 201,
      message: 'Order placed successfully',
      data: enrichedOrder,
      meta: null,
    };

    return res.status(201).json(response);
  } catch (error) {
    const response: IBaseResponse = {
      success: false,
      statusCode: 500,
      message: error.message || 'Failed to create order',
      data: null,
      meta: null,
    };

    return res.status(500).json(response);
  }
}
