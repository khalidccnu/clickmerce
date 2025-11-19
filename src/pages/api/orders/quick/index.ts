import { IBaseResponse } from '@base/interfaces';
import { supabaseServiceClient } from '@lib/config/supabase/serviceClient';
import { Database } from '@lib/constant/database';
import { buildSelectionFn, SupabaseAdapter } from '@lib/utils/supabaseAdapter';
import { Toolbox } from '@lib/utils/toolbox';
import { validate } from '@lib/utils/yup';
import { ENUM_COUPON_TYPES } from '@modules/coupons/lib/enums';
import { ICoupon } from '@modules/coupons/lib/interfaces';
import { IDeliveryZone } from '@modules/delivery-zones/lib/interfaces';
import { orderQuickCreateSchema, TOrderQuickCreateDto } from '@modules/orders/lib/dtos';
import { ENUM_ORDER_PAYMENT_STATUS_TYPES, ENUM_ORDER_STATUS_TYPES } from '@modules/orders/lib/enums';
import { IOrder } from '@modules/orders/lib/interfaces';
import { ENUM_PRODUCT_DISCOUNT_TYPES } from '@modules/products/lib/enums';
import { IProduct } from '@modules/products/lib/interfaces';
import { ENUM_SETTINGS_TAX_TYPES } from '@modules/settings/lib/enums';
import { ISettings } from '@modules/settings/lib/interfaces';
import { IUser } from '@modules/users/lib/interfaces';
import dayjs from 'dayjs';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  switch (method) {
    case 'OPTIONS':
      return res.status(200).end();
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

async function handleCreate(req: NextApiRequest, res: NextApiResponse) {
  const { success, data, ...restProps } = await validate<TOrderQuickCreateDto>(orderQuickCreateSchema, req.body);

  if (!success) return res.status(400).json({ success, data, ...restProps });

  const { name, phone, email, products, delivery_zone_id, payment_method_id, coupon, ...rest } = data;
  const user = { name, phone, email };
  let user_id = null;

  try {
    const existUser = await SupabaseAdapter.findOne<IUser & { password: string }>(
      supabaseServiceClient,
      Database.users,
      { textFilters: { type: 'or', conditions: { phone: { eq: phone }, email: { eq: email } } } },
    );

    if (existUser.data) {
      user_id = existUser.data.id;
    } else {
      const createResult = await SupabaseAdapter.create<IUser & { password: string }>(
        supabaseServiceClient,
        Database.users,
        { ...user, is_system_generated: true },
      );

      if (!createResult.success) {
        const response: IBaseResponse = {
          success: false,
          statusCode: 400,
          message: 'User synchronization failed',
          data: null,
          meta: null,
        };

        return res.status(400).json(response);
      }

      const newUser = createResult.data;

      const userInfoResult = await SupabaseAdapter.create(supabaseServiceClient, Database.usersInfo, {
        user_id: newUser.id,
      });

      if (!userInfoResult.success) {
        await SupabaseAdapter.delete(supabaseServiceClient, Database.users, newUser.id);

        const response: IBaseResponse = {
          success: false,
          statusCode: 500,
          message: 'User synchronization failed',
          data: null,
          meta: null,
        };

        return res.status(500).json(response);
      }

      user_id = newUser.id;
    }

    const operations = [];
    let sub_total_amount = 0;
    let total_cost_amount = 0;
    const allocations = [];

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

      const {
        quantity: _,
        is_active: __,
        created_at: ___,
        created_by: ____,
        updated_at: _____,
        updated_by: ______,
        ...restVariation
      } = variation;

      allocations.push({
        ...restVariation,
        quantity: selected_quantity,
        sale_discount_price: discountPrice,
        discount,
        product_id,
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

    const settingsResponse = await SupabaseAdapter.findOne<ISettings>(supabaseServiceClient, Database.settings, {
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
    let total_redeem = 0;

    if (coupon) {
      const { success, data } = await SupabaseAdapter.findOne<ICoupon>(supabaseServiceClient, Database.coupons, {
        textFilters: { conditions: { code: { eq: coupon } } },
      });

      if (!success || !data) {
        return res.status(404).json({
          success: false,
          statusCode: 404,
          message: 'Coupon is not valid',
          data: null,
          meta: null,
        });
      }

      const now = dayjs();
      const validFrom = data.valid_from ? dayjs(data.valid_from) : null;
      const validUntil = data.valid_until ? dayjs(data.valid_until) : null;

      if (validFrom && now.isBefore(validFrom)) {
        return res.status(400).json({
          success: false,
          statusCode: 400,
          message: 'Coupon is not valid yet!',
          data: null,
          meta: null,
        });
      }

      if (validUntil && now.isAfter(validUntil)) {
        return res.status(400).json({
          success: false,
          statusCode: 400,
          message: 'Coupon has expired!',
          data: null,
          meta: null,
        });
      }

      if (data.min_purchase_amount && sub_total_amount < data.min_purchase_amount) {
        return res.status(400).json({
          success: false,
          statusCode: 400,
          message: 'Minimum purchase amount not met!',
          data: null,
          meta: null,
        });
      }

      if (data.usage_limit && data.usage_count >= data.usage_limit) {
        return res.status(400).json({
          success: false,
          statusCode: 400,
          message: 'Coupon usage limit reached!',
          data: null,
          meta: null,
        });
      }

      const couponResponse = await SupabaseAdapter.update<ICoupon>(supabaseServiceClient, Database.coupons, data?.id, {
        usage_count: data?.usage_count + 1,
      });

      if (!success || !couponResponse.success) {
        const response: IBaseResponse = {
          success: false,
          statusCode: 500,
          message: 'Failed to coupon synchronization',
          data: null,
          meta: null,
        };

        return res.status(500).json(response);
      }

      if (data.type === ENUM_COUPON_TYPES.FIXED) {
        total_redeem = data.amount;
      } else {
        total_redeem = (sub_total_amount * data.amount) / 100;
      }

      if (data.max_redeemable_amount && total_redeem > data.max_redeemable_amount) {
        total_redeem = data.max_redeemable_amount;
      }
    }

    if (total_redeem > profit) {
      total_redeem = profit;
    }

    const deliveryZoneResponse = await SupabaseAdapter.findOne<IDeliveryZone>(
      supabaseServiceClient,
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

    const is_round_off = false,
      pay_amount = 0;
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
      const { product_id, ...restAllocation } = allocation;

      const existingProduct = mergedProductsMap.get(product_id);
      existingProduct.variations.push(restAllocation);
    }

    const mergedProducts = Array.from(mergedProductsMap.values());
    const paymentStatus = ENUM_ORDER_PAYMENT_STATUS_TYPES.PROCESSING;

    const purifiedOrder = {
      ...rest,
      code: Toolbox.generateKey({ prefix: 'INV', type: 'upper' }),
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
      payment_status: paymentStatus,
      status: ENUM_ORDER_STATUS_TYPES.PENDING,
      customer_id: user_id,
      payment_method_id,
      delivery_zone_id,
    };

    const orderResponse = await SupabaseAdapter.create<IOrder>(supabaseServiceClient, Database.orders, purifiedOrder);

    if (!orderResponse.success) {
      const response: IBaseResponse = {
        success: false,
        statusCode: 500,
        message: orderResponse.message || 'Failed to place order',
        data: null,
        meta: null,
      };

      return res.status(500).json(response);
    }

    for (const operation of operations) {
      if (operation.operation === 'delete') {
        await SupabaseAdapter.delete(supabaseServiceClient, operation.table, operation.id);
      } else {
        await SupabaseAdapter.update(supabaseServiceClient, operation.table, operation.id, operation.data);
      }
    }

    const completeOrderResponse = await SupabaseAdapter.findOne<IOrder>(
      supabaseServiceClient,
      Database.orders,
      { textFilters: { conditions: { id: { eq: orderResponse.data.id as string } } } },
      {
        selection: buildSelectionFn({
          relations: {
            customer: {
              table: Database.users,
              foreignKey: 'customer_id',
              nested: { user_info: { table: Database.usersInfo } },
            },
            payment_method: { table: Database.paymentMethods, foreignKey: 'payment_method_id' },
            delivery_zone: { table: Database.deliveryZones, foreignKey: 'delivery_zone_id' },
            created_by: { table: Database.users, foreignKey: 'created_by_id' },
            updated_by: { table: Database.users, foreignKey: 'updated_by_id' },
          },
          filters: { id: orderResponse.data.id as string },
        }),
      },
    );

    let enrichedOrder = completeOrderResponse.data;

    if (enrichedOrder && enrichedOrder.products && Array.isArray(enrichedOrder.products)) {
      const enrichedProducts = await Promise.all(
        enrichedOrder.products.map(async (orderProduct) => {
          try {
            const currentProductResponse = await SupabaseAdapter.findOne(
              supabaseServiceClient,
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
      message: error.message || 'Failed to place order',
      data: null,
      meta: null,
    };

    return res.status(500).json(response);
  }
}
