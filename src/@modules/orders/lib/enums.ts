export enum ENUM_ORDER_STATUS_TYPES {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  DELIVERED = 'DELIVERED',
}

export type TOrderStatusType = `${ENUM_ORDER_STATUS_TYPES}`;
export const orderStatusTypes: TOrderStatusType[] = Object.values(ENUM_ORDER_STATUS_TYPES);

export enum ENUM_ORDER_PAYMENT_STATUS_TYPES {
  PENDING = 'PENDING',
  PARTIAL = 'PARTIAL',
  FULL = 'FULL',
}

export type TOrderPaymentStatusType = `${ENUM_ORDER_PAYMENT_STATUS_TYPES}`;
export const orderPaymentStatusTypes: TOrderPaymentStatusType[] = Object.values(ENUM_ORDER_PAYMENT_STATUS_TYPES);
