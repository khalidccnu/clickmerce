import {
  ENUM_ORDER_PAYMENT_STATUS_TYPES,
  ENUM_ORDER_STATUS_TYPES,
  TOrderPaymentStatusType,
  TOrderStatusType,
} from './enums';

export const OrderStatusColorFn = (status: TOrderStatusType) => {
  switch (status) {
    case ENUM_ORDER_STATUS_TYPES.PENDING:
      return 'orange';
    case ENUM_ORDER_STATUS_TYPES.PROCESSING:
      return 'blue';
    case ENUM_ORDER_STATUS_TYPES.COMPLETED:
      return 'green';
    case ENUM_ORDER_STATUS_TYPES.CANCELLED:
      return 'red';
    case ENUM_ORDER_STATUS_TYPES.DELIVERED:
      return 'purple';
    default:
      return 'default';
  }
};

export const OrderPaymentStatusColorFn = (status: TOrderPaymentStatusType) => {
  switch (status) {
    case ENUM_ORDER_PAYMENT_STATUS_TYPES.FULL:
      return 'green';
    case ENUM_ORDER_PAYMENT_STATUS_TYPES.PARTIAL:
      return 'orange';
    case ENUM_ORDER_PAYMENT_STATUS_TYPES.PENDING:
      return 'red';
    default:
      return 'default';
  }
};
