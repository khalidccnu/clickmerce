import { IBaseResponse } from '@base/interfaces';
import { supabaseServiceClient } from '@lib/config/supabase/serviceClient';
import { Database } from '@lib/constant/database';
import { SupabaseAdapter } from '@lib/utils/supabaseAdapter';
import { Toolbox } from '@lib/utils/toolbox';
import { getServerAuthSession } from '@modules/auth/lib/utils/server';
import { IDashboardAnalysesResponse, IDashboardAnalysis } from '@modules/dashboard/lib/interfaces';
import { IOrder } from '@modules/orders/lib/interfaces';
import dayjs from 'dayjs';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  switch (method) {
    case 'OPTIONS':
      return res.status(200).end();
    case 'GET':
      return handleAnalyses(req, res);
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

async function handleAnalyses(req: NextApiRequest, res: NextApiResponse) {
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

  try {
    const now = dayjs();
    const elevenMonthsAgo = now.subtract(11, 'month').startOf('month').toISOString();
    const currentMonthEnd = now.endOf('month').toISOString();

    const ordersResult = await SupabaseAdapter.find<IOrder>(supabaseServiceClient, Database.orders, {
      dateFilters: {
        conditions: {
          created_at: { gte: elevenMonthsAgo, lte: currentMonthEnd },
        },
      },
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

    const monthlyDist = orders.reduce((acc: Record<string, any>, order) => {
      const month = dayjs(order.created_at).format('MMM');

      if (!acc[month]) {
        acc[month] = {
          sales_amount: 0,
          profit_amount: 0,
          orders: 0,
        };
      }

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
      const orderProfit = Math.max(orderSale - orderCost, 0);

      acc[month].sales_amount += orderSale;
      acc[month].profit_amount += orderProfit;
      acc[month].orders += 1;

      return acc;
    }, {});

    const analyses: IDashboardAnalysis[] = Object.keys(monthlyDist).map((month) => ({
      month,
      sales_amount: Toolbox.truncateNumber(monthlyDist[month].sales_amount),
      profit_amount: Toolbox.truncateNumber(monthlyDist[month].profit_amount),
      orders: monthlyDist[month].orders,
    }));

    const response: IDashboardAnalysesResponse = {
      success: true,
      statusCode: 200,
      message: 'Dashboard analyses fetched successfully',
      data: analyses,
      meta: null,
    };

    return res.status(200).json(response);
  } catch (error) {
    const response: IBaseResponse = {
      success: false,
      statusCode: 500,
      message: 'Failed to fetch dashboard analyses',
      data: null,
      meta: null,
    };

    return res.status(500).json(response);
  }
}
