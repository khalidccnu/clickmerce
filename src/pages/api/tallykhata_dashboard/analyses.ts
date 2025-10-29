import { IBaseResponse } from '@base/interfaces';
import { supabaseServiceClient } from '@lib/config/supabase/serviceClient';
import { Database } from '@lib/constant/database';
import { SupabaseAdapter } from '@lib/utils/supabaseAdapter';
import { Toolbox } from '@lib/utils/toolbox';
import { getServerAuthSession } from '@modules/auth/lib/utils/server';
import {
  ITallykhataDashboardAnalysesResponse,
  ITallykhataDashboardAnalysis,
} from '@modules/tallykhata-dashboard/lib/interfaces';
import { ENUM_TRANSACTION_TYPES } from '@modules/transactions/lib/enums';
import { ITransaction } from '@modules/transactions/lib/interfaces';
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

    const transactionsResult = await SupabaseAdapter.find<ITransaction>(supabaseServiceClient, Database.transactions, {
      dateFilters: {
        conditions: {
          created_at: { gte: elevenMonthsAgo, lte: currentMonthEnd },
        },
      },
    });

    if (!transactionsResult.success) {
      const response: IBaseResponse<[]> = {
        success: false,
        statusCode: transactionsResult.statusCode || 400,
        message: 'Failed to fetch transactions',
        data: [],
        meta: null,
      };

      return res.status(transactionsResult.statusCode || 400).json(response);
    }

    const transactions = transactionsResult.data || [];

    const monthlyDist = transactions.reduce((acc: Record<string, any>, transaction) => {
      const month = dayjs(transaction.created_at).format('MMM');

      if (!acc[month]) {
        acc[month] = {
          credit_amount: 0,
          debit_amount: 0,
          transactions: 0,
        };
      }

      const amount = +transaction.amount || 0;

      if (transaction.type === ENUM_TRANSACTION_TYPES.CREDIT) {
        acc[month].credit_amount += amount;
      } else if (transaction.type === ENUM_TRANSACTION_TYPES.DEBIT) {
        acc[month].debit_amount += amount;
      }

      acc[month].transactions += 1;

      return acc;
    }, {});

    const analyses: ITallykhataDashboardAnalysis[] = Object.keys(monthlyDist).map((month) => ({
      month,
      credit_amount: Toolbox.truncateNumber(monthlyDist[month].credit_amount),
      debit_amount: Toolbox.truncateNumber(monthlyDist[month].debit_amount),
      transactions: monthlyDist[month].transactions,
    }));

    const response: ITallykhataDashboardAnalysesResponse = {
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
