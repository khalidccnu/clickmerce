import { IBaseResponse } from '@base/interfaces';
import { supabaseServiceClient } from '@lib/config/supabase/serviceClient';
import { Database } from '@lib/constant/database';
import { SupabaseAdapter } from '@lib/utils/supabaseAdapter';
import { getServerAuthSession } from '@modules/auth/lib/utils/server';
import { IDashboardQuickStatistics, IDashboardQuickStatisticsResponse } from '@modules/dashboard/lib/interfaces';
import { ENUM_ORDER_STATUS_TYPES } from '@modules/orders/lib/enums';
import { IOrder } from '@modules/orders/lib/interfaces';
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

  try {
    const ordersResult = await SupabaseAdapter.find<IOrder>(supabaseServiceClient, Database.orders, {
      textFilters: { conditions: { customer_id: { eq: user?.id as string } } },
    });

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
    const deliveredOrders = orders.filter((order) => order.status === ENUM_ORDER_STATUS_TYPES.DELIVERED).length;
    const cancelledOrders = orders.filter((order) => order.status === ENUM_ORDER_STATUS_TYPES.CANCELLED).length;

    const statistics: IDashboardQuickStatistics = {
      pending_orders: pendingOrders,
      processing_orders: processingOrders,
      delivered_orders: deliveredOrders,
      cancelled_orders: cancelledOrders,
    };

    const response: IDashboardQuickStatisticsResponse = {
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
