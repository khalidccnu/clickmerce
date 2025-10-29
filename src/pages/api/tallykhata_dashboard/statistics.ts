import { IBaseResponse } from '@base/interfaces';
import { supabaseServiceClient } from '@lib/config/supabase/serviceClient';
import { Database } from '@lib/constant/database';
import { SupabaseAdapter } from '@lib/utils/supabaseAdapter';
import { Toolbox } from '@lib/utils/toolbox';
import { validate } from '@lib/utils/yup';
import { getServerAuthSession } from '@modules/auth/lib/utils/server';
import {
  tallykhataDashboardStatisticsFilterSchema,
  TTallykhataDashboardStatisticsFilterDto,
} from '@modules/tallykhata-dashboard/lib/dtos';
import {
  ITallykhataDashboardStatistics,
  ITallykhataDashboardStatisticsResponse,
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

  const { success, data, ...restProps } = await validate<TTallykhataDashboardStatisticsFilterDto>(
    tallykhataDashboardStatisticsFilterSchema,
    req.query,
  );

  if (!success) return res.status(400).json({ success, data, ...restProps });

  const {
    start_date = dayjs().startOf('day').toISOString(),
    end_date = dayjs().endOf('day').toISOString(),
    user_id,
  } = data;
  const newFilters: any = { start_date, end_date, user_id };

  try {
    const transactionsResult = await SupabaseAdapter.find<ITransaction>(
      supabaseServiceClient,
      Database.transactions,
      newFilters,
    );

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

    const totalTransactions = transactions.length;
    const creditTransactions = transactions.filter(
      (transaction) => transaction.type === ENUM_TRANSACTION_TYPES.CREDIT,
    ).length;
    const debitTransactions = transactions.filter(
      (transaction) => transaction.type === ENUM_TRANSACTION_TYPES.DEBIT,
    ).length;

    const { totalCreditAmount, totalDebitAmount } = transactions.reduce(
      (acc, transaction) => {
        const amount = Number(transaction.amount) || 0;

        if (transaction.type === ENUM_TRANSACTION_TYPES.CREDIT) {
          acc.totalCreditAmount += amount;
        } else if (transaction.type === ENUM_TRANSACTION_TYPES.DEBIT) {
          acc.totalDebitAmount += amount;
        }

        return acc;
      },
      { totalCreditAmount: 0, totalDebitAmount: 0 },
    );

    const netBalance = totalCreditAmount - totalDebitAmount;

    const statistics: ITallykhataDashboardStatistics = {
      total_transactions: totalTransactions,
      credit_transactions: creditTransactions,
      debit_transactions: debitTransactions,
      total_credit_amount: Toolbox.truncateNumber(totalCreditAmount),
      total_debit_amount: Toolbox.truncateNumber(totalDebitAmount),
      net_balance: Toolbox.truncateNumber(netBalance),
    };

    const response: ITallykhataDashboardStatisticsResponse = {
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
