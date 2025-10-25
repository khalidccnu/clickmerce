import { IBaseResponse } from '@base/interfaces';
import { supabaseServiceClient } from '@lib/config/supabase/serviceClient';
import { Database } from '@lib/constant/database';
import { SupabaseAdapter } from '@lib/utils/supabaseAdapter';
import { Toolbox } from '@lib/utils/toolbox';
import { validate } from '@lib/utils/yup';
import { getServerAuthSession } from '@modules/auth/lib/utils/server';
import { dashboardStatisticsFilterSchema, TDashboardStatisticsFilterDto } from '@modules/dashboard/lib/dtos';
import { IDashboardStatistics, IDashboardStatisticsResponse } from '@modules/dashboard/lib/interfaces';
import { ENUM_ORDER_STATUS_TYPES } from '@modules/orders/lib/enums';
import { IOrder } from '@modules/orders/lib/interfaces';
import dayjs from 'dayjs';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  switch (method) {
    case 'OPTIONS':
      return res.status(200).end();
    case 'GET':
      return handleStatistics(req, res);
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

async function handleStatistics(req: NextApiRequest, res: NextApiResponse) {
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

  const { success, data, ...restProps } = await validate<TDashboardStatisticsFilterDto>(
    dashboardStatisticsFilterSchema,
    req.query,
  );

  if (!success) return res.status(400).json({ success, data, ...restProps });

  const { start_date = dayjs().startOf('day').toISOString(), end_date = dayjs().endOf('day').toISOString() } = data;
  const newFilters: any = { start_date, end_date };

  try {
    const ordersResult = await SupabaseAdapter.find<IOrder>(supabaseServiceClient, Database.orders, newFilters);

    if (!ordersResult.success) {
      const response: IBaseResponse<[]> = {
        success: false,
        statusCode: ordersResult.statusCode || 400,
        message: 'Failed to fetch orders',
        data: [],
        meta: null,
      };

      return res.status(ordersResult.statusCode || 400).json(response);
    }

    const orders = ordersResult.data || [];

    const pendingOrders = orders.filter((order) => order.status === ENUM_ORDER_STATUS_TYPES.PENDING).length;
    const processingOrders = orders.filter((order) => order.status === ENUM_ORDER_STATUS_TYPES.PROCESSING).length;
    const shippedOrders = orders.filter((order) => order.status === ENUM_ORDER_STATUS_TYPES.SHIPPED).length;
    const deliveredOrders = orders.filter((order) => order.status === ENUM_ORDER_STATUS_TYPES.DELIVERED).length;
    const cancelledOrders = orders.filter((order) => order.status === ENUM_ORDER_STATUS_TYPES.CANCELLED).length;

    const { totalCostsAmount, totalSalesAmount, totalDueAmount } = orders.reduce(
      (acc, order) => {
        const orderCost =
          order.products?.reduce((productCost, product) => {
            return (
              productCost +
              (product.variations?.reduce((variationCost, variation) => {
                return variationCost + (variation.cost_price || 0) * (variation.quantity || 0);
              }, 0) || 0)
            );
          }, 0) || 0;

        const orderSale = order.sub_total_amount || 0;
        const orderDue = order.due_amount || 0;

        acc.totalCostsAmount += orderCost;
        acc.totalSalesAmount += orderSale;
        acc.totalDueAmount += orderDue;

        return acc;
      },
      { totalCostsAmount: 0, totalSalesAmount: 0, totalDueAmount: 0 },
    );

    const totalProfitAmount = totalSalesAmount > totalCostsAmount ? totalSalesAmount - totalCostsAmount : 0;

    const statistics: IDashboardStatistics = {
      pending_orders: pendingOrders,
      processing_orders: processingOrders,
      shipped_orders: shippedOrders,
      delivered_orders: deliveredOrders,
      cancelled_orders: cancelledOrders,
      total_sales_amount: Toolbox.truncateNumber(totalSalesAmount),
      total_due_amount: Toolbox.truncateNumber(totalDueAmount),
      total_profit_amount: Toolbox.truncateNumber(totalProfitAmount),
    };

    const response: IDashboardStatisticsResponse = {
      success: true,
      statusCode: 200,
      message: 'Dashboard statistics fetched successfully',
      data: statistics,
      meta: null,
    };

    return res.status(200).json(response);
  } catch (error) {
    const response: IBaseResponse = {
      success: false,
      statusCode: 500,
      message: 'Failed to fetch dashboard statistics',
      data: null,
      meta: null,
    };

    return res.status(500).json(response);
  }
}
