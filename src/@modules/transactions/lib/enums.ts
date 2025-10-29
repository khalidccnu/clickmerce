export enum ENUM_TRANSACTION_TYPES {
  CREDIT = 'CREDIT',
  DEBIT = 'DEBIT',
}

export type TTransactionType = `${ENUM_TRANSACTION_TYPES}`;
export const transactionTypes: TTransactionType[] = Object.values(ENUM_TRANSACTION_TYPES);
