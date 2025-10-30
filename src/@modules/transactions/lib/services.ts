import { IBaseResponse, TId } from '@base/interfaces';
import { supabaseBrowserClient } from '@lib/config/supabase/browserClient';
import { Database } from '@lib/constant/database';
import { responseHandlerFn } from '@lib/utils/errorHandler';
import { buildSelectionFn, SupabaseAdapter } from '@lib/utils/supabaseAdapter';
import { Toolbox } from '@lib/utils/toolbox';
import { getAuthSession } from '@modules/auth/lib/utils/client';
import { ENUM_TRANSACTION_TYPES } from './enums';
import { ITransaction, ITransactionCreate, ITransactionsFilter, ITransactionsResponse } from './interfaces';

const END_POINT: string = Database.transactions;

export const TransactionsServices = {
  NAME: END_POINT,

  findById: async (id: TId): Promise<IBaseResponse<ITransaction>> => {
    try {
      const res = await SupabaseAdapter.findById<ITransaction>(supabaseBrowserClient, END_POINT, id);
      return Promise.resolve(res);
    } catch (error) {
      throw responseHandlerFn(error);
    }
  },

  find: async (filters: ITransactionsFilter): Promise<ITransactionsResponse> => {
    const { start_date, end_date, ...restFilters } = filters;
    const newFilters: any = { ...restFilters };

    if (start_date) {
      newFilters.start_date = decodeURIComponent(start_date);
    }

    if (end_date) {
      newFilters.end_date = decodeURIComponent(end_date);
    }

    try {
      const res = await SupabaseAdapter.find<ITransaction>(supabaseBrowserClient, END_POINT, newFilters, {
        selection: buildSelectionFn({
          relations: {
            user: { table: Database.users, columns: ['id', 'name', 'phone', 'email'], foreignKey: 'user_id' },
            created_by: {
              table: Database.users,
              columns: ['id', 'name', 'phone', 'email'],
              foreignKey: 'created_by_id',
            },
          },
          filters: newFilters,
        }),
      });
      return Promise.resolve(res);
    } catch (error) {
      throw responseHandlerFn(error);
    }
  },

  create: async (payload: ITransactionCreate): Promise<IBaseResponse<ITransaction>> => {
    const { user } = getAuthSession();
    const code = Toolbox.generateKey({ prefix: 'TXN', type: 'upper' });

    try {
      const res = await SupabaseAdapter.create<ITransaction>(
        supabaseBrowserClient,
        END_POINT,
        {
          ...payload,
          code,
          created_by_id: user.id,
        },
        {
          selection: buildSelectionFn({
            relations: {
              user: {
                table: Database.users,
                columns: ['id', 'name', 'phone', 'email'],
                foreignKey: 'user_id',
                nested: { user_info: { table: Database.usersInfo, columns: ['id', 'balance'] } },
              },
            },
          }),
        },
      );

      if (res.success) {
        const userBalance = res?.data?.user?.user_info?.balance || 0;
        const userNewBalance =
          userBalance + (payload.type === ENUM_TRANSACTION_TYPES.CREDIT ? payload.amount : -payload.amount);

        await SupabaseAdapter.update(supabaseBrowserClient, Database.usersInfo, res?.data?.user?.user_info?.id, {
          balance: userNewBalance,
        });
      }

      return Promise.resolve(res);
    } catch (error) {
      throw responseHandlerFn(error);
    }
  },

  // update: async (payload: { id: TId; data: Partial<ITransactionCreate> }): Promise<IBaseResponse<ITransaction>> => {
  //   try {
  //     const res = await SupabaseAdapter.update<ITransaction>(
  //       supabaseBrowserClient,
  //       END_POINT,
  //       payload.id,
  //       payload.data,
  //     );
  //     return Promise.resolve(res);
  //   } catch (error) {
  //     throw responseHandlerFn(error);
  //   }
  // },

  // delete: async (id: TId): Promise<IBaseResponse<ITransaction>> => {
  //   try {
  //     const res = await SupabaseAdapter.delete<ITransaction>(supabaseBrowserClient, END_POINT, id);
  //     return Promise.resolve(res);
  //   } catch (error) {
  //     throw responseHandlerFn(error);
  //   }
  // },
};
