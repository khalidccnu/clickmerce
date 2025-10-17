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
    case ENUM_ORDER_STATUS_TYPES.CONFIRMED:
      return 'gold';
    case ENUM_ORDER_STATUS_TYPES.PROCESSING:
      return 'blue';
    case ENUM_ORDER_STATUS_TYPES.SHIPPED:
      return 'cyan';
    case ENUM_ORDER_STATUS_TYPES.OUT_FOR_DELIVERY:
      return 'purple';
    case ENUM_ORDER_STATUS_TYPES.DELIVERED:
      return 'green';
    case ENUM_ORDER_STATUS_TYPES.CANCELLED:
      return 'red';
    // case ENUM_ORDER_STATUS_TYPES.RETURNED:
    //   return 'volcano';
    default:
      return 'default';
  }
};

export const OrderPaymentStatusColorFn = (status: TOrderPaymentStatusType) => {
  switch (status) {
    case ENUM_ORDER_PAYMENT_STATUS_TYPES.PENDING:
      return 'orange';
    case ENUM_ORDER_PAYMENT_STATUS_TYPES.PROCESSING:
      return 'blue';
    case ENUM_ORDER_PAYMENT_STATUS_TYPES.PARTIALLY_PAID:
      return 'gold';
    case ENUM_ORDER_PAYMENT_STATUS_TYPES.PAID:
      return 'green';
    case ENUM_ORDER_PAYMENT_STATUS_TYPES.FAILED:
      return 'red';
    // case ENUM_ORDER_PAYMENT_STATUS_TYPES.REFUNDED:
    //   return 'purple';
    // case ENUM_ORDER_PAYMENT_STATUS_TYPES.PARTIALLY_REFUNDED:
    //   return 'volcano';
    case ENUM_ORDER_PAYMENT_STATUS_TYPES.CANCELLED:
      return 'gray';
    default:
      return 'default';
  }
};
