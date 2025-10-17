import { IBaseResponse, TId } from '@base/interfaces';
import { createSupabaseServerClient } from '@lib/config/supabase/serverClient';
import { Database } from '@lib/constant/database';
import { buildSelectionFn, SupabaseAdapter } from '@lib/utils/supabaseAdapter';
import { Toolbox } from '@lib/utils/toolbox';
import { validate } from '@lib/utils/yup';
import { getServerAuthSession } from '@modules/auth/lib/utils/server';
import { orderReturnSchema, orderUpdateSchema, TOrderReturnDto, TOrderUpdateDto } from '@modules/orders/lib/dtos';
import { ENUM_ORDER_PAYMENT_STATUS_TYPES } from '@modules/orders/lib/enums';
import { IOrder } from '@modules/orders/lib/interfaces';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  switch (method) {
    case 'OPTIONS':
      return res.status(200).end();
    case 'GET':
      return handleGet(req, res);
    case 'PATCH':
      return handleUpdate(req, res);
    case 'POST':
      return handleReturn(req, res);
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
    const result = await SupabaseAdapter.findOne<IOrder>(
      supabaseServerClient,
      Database.orders,
      { textFilters: { conditions: { id: { eq: id as string } } } },
      {
        selection: buildSelectionFn({
          relations: {
            customer: { table: Database.users, foreignKey: 'customer_id' },
            payment_method: { table: Database.paymentMethods },
            delivery_zone: { table: Database.deliveryZones },
            created_by: { table: Database.users, foreignKey: 'created_by_id' },
            updated_by: { table: Database.users, foreignKey: 'updated_by_id' },
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

    if (result.data.products && Array.isArray(result.data.products)) {
      const enrichedProducts = await Promise.all(
        result.data.products.map(async (orderProduct) => {
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

      result.data.products = enrichedProducts;
    }

    const response: IBaseResponse<IOrder> = {
      success: true,
      statusCode: 200,
      message: 'Order fetched successfully',
      data: result.data,
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

async function handleUpdate(req: NextApiRequest, res: NextApiResponse) {
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

  const { success, data, ...restProps } = await validate<TOrderUpdateDto>(orderUpdateSchema, req.body);

  if (!success) return res.status(400).json({ success, data, ...restProps });

  const { pay_amount, status } = data;

  const supabaseServerClient = createSupabaseServerClient(req, res);

  try {
    const orderResponse = await SupabaseAdapter.findOne<IOrder>(supabaseServerClient, Database.orders, {
      textFilters: { conditions: { id: { eq: id as string } } },
    });

    if (!orderResponse.success || !orderResponse.data) {
      const response: IBaseResponse = {
        success: false,
        statusCode: 404,
        message: 'Order not found',
        data: null,
        meta: null,
      };

      return res.status(404).json(response);
    }

    const order = orderResponse.data;
    let updateResult: IBaseResponse<IOrder>;

    if (pay_amount) {
      const newPayAmount =
        pay_amount > order.due_amount ? order.pay_amount + order.due_amount : order.pay_amount + pay_amount;

      const dueAmount = pay_amount > order.due_amount ? 0 : order.due_amount - pay_amount;

      const newPaymentStatus =
        pay_amount >= order.due_amount ? ENUM_ORDER_PAYMENT_STATUS_TYPES.PAID : order.payment_status;

      updateResult = await SupabaseAdapter.update<IOrder>(supabaseServerClient, Database.orders, id as string, {
        pay_amount: newPayAmount,
        due_amount: dueAmount,
        payment_status: newPaymentStatus,
        updated_by_id: user?.id,
      });

      if (!updateResult.success) {
        const response: IBaseResponse = {
          success: false,
          statusCode: 500,
          message: 'Failed to update order',
          data: null,
          meta: null,
        };

        return res.status(500).json(response);
      }
    }

    if (status) {
      if (status === ENUM_ORDER_PAYMENT_STATUS_TYPES.CANCELLED) {
        const products = order.products || [];

        for (const orderProduct of products) {
          for (const variation of orderProduct.variations) {
            const existingVariation = await SupabaseAdapter.findById(
              supabaseServerClient,
              Database.productVariations,
              variation.id,
            );

            if (existingVariation.success && existingVariation.data) {
              await SupabaseAdapter.update(supabaseServerClient, Database.productVariations, variation.id, {
                quantity: existingVariation.data.quantity + variation.quantity,
              });
            } else {
              const { sale_discount_price: _, ...rest } = variation;

              await SupabaseAdapter.create(supabaseServerClient, Database.productVariations, {
                ...rest,
                quantity: variation.quantity,
                product_id: orderProduct.id,
              });
            }
          }
        }
      }

      updateResult = await SupabaseAdapter.update<IOrder>(supabaseServerClient, Database.orders, id as string, {
        status: status,
        updated_by_id: user?.id,
      });

      if (!updateResult.success) {
        const response: IBaseResponse = {
          success: false,
          statusCode: 500,
          message: 'Failed to update order',
          data: null,
          meta: null,
        };

        return res.status(500).json(response);
      }
    }

    const updatedOrder = await SupabaseAdapter.findOne<IOrder>(
      supabaseServerClient,
      Database.orders,
      { textFilters: { conditions: { id: { eq: id as string } } } },
      {
        selection: buildSelectionFn({
          relations: {
            customer: { table: Database.users, foreignKey: 'customer_id' },
            payment_method: { table: Database.paymentMethods },
            delivery_zone: { table: Database.deliveryZones },
            created_by: { table: Database.users, foreignKey: 'created_by_id' },
            updated_by: { table: Database.users, foreignKey: 'updated_by_id' },
          },
          filters: { id: { eq: id as string } },
        }),
      },
    );

    const response: IBaseResponse<IOrder> = {
      success: true,
      statusCode: 200,
      message: 'Order updated successfully',
      data: updatedOrder.data || updateResult.data,
      meta: null,
    };

    return res.status(200).json(response);
  } catch (error) {
    const response: IBaseResponse = {
      success: false,
      statusCode: 500,
      message: 'Failed to update order',
      data: null,
      meta: null,
    };

    return res.status(500).json(response);
  }
}

async function handleReturn(req: NextApiRequest, res: NextApiResponse) {
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

  const { success, data, ...restProps } = await validate<TOrderReturnDto>(orderReturnSchema, req.body);

  if (!success) return res.status(400).json({ success, data, ...restProps });

  const { redeem_amount, products } = data;

  if (!products || !products.length) {
    const response: IBaseResponse = {
      success: false,
      statusCode: 400,
      message: 'Return products are required',
      data: null,
      meta: null,
    };

    return res.status(400).json(response);
  }

  const supabaseServerClient = createSupabaseServerClient(req, res);

  try {
    const orderResponse = await SupabaseAdapter.findOne<IOrder>(supabaseServerClient, Database.orders, {
      textFilters: { conditions: { id: { eq: id as string } } },
    });

    if (!orderResponse.success || !orderResponse.data) {
      const response: IBaseResponse = {
        success: false,
        statusCode: 404,
        message: 'Order not found',
        data: null,
        meta: null,
      };

      return res.status(404).json(response);
    }

    const order = orderResponse.data;

    for (const returnProduct of products) {
      for (const variation of returnProduct.variations) {
        const existingVariation = await SupabaseAdapter.findById(
          supabaseServerClient,
          Database.productVariations,
          variation.id,
        );

        if (existingVariation.success && existingVariation.data) {
          await SupabaseAdapter.update(supabaseServerClient, Database.productVariations, variation.id, {
            quantity: existingVariation.data.quantity + variation.return_quantity,
          });
        } else {
          let orderVariation = null;

          for (const orderProduct of order.products || []) {
            orderVariation = orderProduct.variations?.find((v) => v.id === variation.id);
            if (orderVariation) break;
          }

          if (orderVariation) {
            const { sale_discount_price: _, ...rest } = orderVariation;

            await SupabaseAdapter.create(supabaseServerClient, Database.productVariations, {
              ...rest,
              quantity: variation.return_quantity,
              product_id: returnProduct.id,
            });
          }
        }
      }
    }

    const orderProducts = order.products || [];

    const returnVariationsMap = new Map<string, number>();

    products.forEach((returnProduct) => {
      returnProduct.variations.forEach((returnVariation) => {
        returnVariationsMap.set(returnVariation.id, returnVariation.return_quantity);
      });
    });

    const purifiedProducts = orderProducts
      .map((orderProduct) => {
        const sanitizedVariations = orderProduct.variations.map((orderVariation) => {
          const returnQuantity = returnVariationsMap.get(orderVariation.id as string);

          if (returnQuantity) {
            const sanitizedVariation = {
              ...orderVariation,
              quantity: orderVariation.quantity - returnQuantity,
              sale_discount_price: 0,
            };

            return sanitizedVariation;
          }

          return orderVariation;
        });

        return {
          ...orderProduct,
          variations: sanitizedVariations.filter((variation) => variation.quantity),
        };
      })
      .filter((product) => product.variations.length);

    let totalRemainingProfit = 0;

    for (const product of purifiedProducts) {
      for (const variation of product.variations) {
        const remainingQuantity = Math.max(0, variation.quantity || 0);
        const salePrice = Math.max(0, variation.sale_price || 0);
        const costPrice = Math.max(0, variation.cost_price || 0);
        const discountAmount = Math.max(0, variation.sale_discount_price || 0);

        if (salePrice && remainingQuantity) {
          const discountPrice = Math.max(costPrice, salePrice - discountAmount);
          const profitPerUnit = Math.max(0, discountPrice - costPrice);
          const remainingProfit = profitPerUnit * remainingQuantity;
          totalRemainingProfit += remainingProfit;
        }
      }
    }

    const adjustedRedeemAmount = Math.min(redeem_amount, totalRemainingProfit);

    const { subTotalPrice } = purifiedProducts.reduce(
      (acc, current) => {
        current.variations.forEach((variation) => {
          const salePrice = Math.max(0, variation.sale_price || 0);
          const costPrice = Math.max(0, variation.cost_price || 0);
          const discountAmount = Math.max(0, variation.sale_discount_price || 0);
          const discountPrice = Math.max(costPrice, salePrice - discountAmount);

          acc.subTotalPrice += discountPrice * variation.quantity;
        });

        return acc;
      },
      { subTotalPrice: 0 },
    );

    const grandTotal =
      subTotalPrice + order.vat_amount + order.tax_amount + order.delivery_charge - adjustedRedeemAmount;
    const total = order.round_off_amount ? Math.round(grandTotal) : grandTotal;
    const payAmount = order.pay_amount > total ? total : order.pay_amount;
    const dueAmount = total - payAmount;
    const paymentStatus = payAmount
      ? dueAmount
        ? ENUM_ORDER_PAYMENT_STATUS_TYPES.PARTIALLY_PAID
        : ENUM_ORDER_PAYMENT_STATUS_TYPES.PAID
      : ENUM_ORDER_PAYMENT_STATUS_TYPES.PENDING;

    const purifiedOrder = {
      products: purifiedProducts,
      sub_total_amount: subTotalPrice,
      grand_total_amount: total,
      pay_amount: payAmount,
      due_amount: dueAmount,
      payment_status: paymentStatus,
      redeem_amount: adjustedRedeemAmount,
      updated_by_id: user?.id,
    };

    const updateResult = await SupabaseAdapter.update<IOrder>(
      supabaseServerClient,
      Database.orders,
      id as string,
      purifiedOrder,
    );

    if (!updateResult.success) {
      const response: IBaseResponse = {
        success: false,
        statusCode: 500,
        message: 'Failed to process order return',
        data: null,
        meta: null,
      };

      return res.status(500).json(response);
    }

    const returnProductsMap = new Map<string, any>();

    for (const orderProduct of orderProducts) {
      const returnedVariations = (orderProduct.variations || [])
        .map((orderVariation) => {
          const returnQuantity = returnVariationsMap.get(orderVariation.id as string);
          if (!returnQuantity) return null;

          return {
            ...orderVariation,
            quantity: returnQuantity,
            sale_discount_price: 0,
          };
        })
        .filter(Boolean);

      if (returnedVariations.length) {
        const existingProduct = returnProductsMap.get(orderProduct.id as string);

        if (existingProduct) {
          existingProduct.variations.push(...returnedVariations);
        } else {
          returnProductsMap.set(orderProduct.id as string, {
            ...orderProduct,
            variations: returnedVariations,
          });
        }
      }
    }

    const purifiedReturnProducts = Array.from(returnProductsMap.values());

    const orderReturn = {
      code: Toolbox.generateKey({ prefix: 'RTN', type: 'upper' }),
      products: purifiedReturnProducts,
      order_id: id,
      created_by_id: user?.id,
    };

    const orderReturnResult = await SupabaseAdapter.create(supabaseServerClient, Database.orderReturns, orderReturn);

    if (!orderReturnResult.success) {
      const response: IBaseResponse = {
        success: false,
        statusCode: 500,
        message: 'Failed to process order return',
        data: null,
        meta: null,
      };

      return res.status(500).json(response);
    }

    const updatedOrder = await SupabaseAdapter.findOne<IOrder>(
      supabaseServerClient,
      Database.orders,
      { textFilters: { conditions: { id: { eq: id as string } } } },
      {
        selection: buildSelectionFn({
          relations: {
            customer: { table: Database.users, foreignKey: 'customer_id' },
            payment_method: { table: Database.paymentMethods },
            delivery_zone: { table: Database.deliveryZones },
            created_by: { table: Database.users, foreignKey: 'created_by_id' },
            updated_by: { table: Database.users, foreignKey: 'updated_by_id' },
          },
          filters: { id: { eq: id as string } },
        }),
      },
    );

    const response: IBaseResponse<IOrder> = {
      success: true,
      statusCode: 200,
      message: `Order return processed successfully`,
      data: updatedOrder.data || updateResult.data,
      meta: null,
    };

    return res.status(200).json(response);
  } catch (error) {
    const response: IBaseResponse = {
      success: false,
      statusCode: 500,
      message: 'Failed to process order return',
      data: null,
      meta: null,
    };

    return res.status(500).json(response);
  }
}
