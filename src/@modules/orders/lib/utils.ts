import { TId } from '@base/interfaces';
import { IOrderState } from '@lib/redux/order/orderSlice';
import { ENUM_PRODUCT_DISCOUNT_TYPES } from '@modules/products/lib/enums';
import { IProductVariation } from '@modules/products/lib/interfaces';
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

export const hasProductInCartFn = (productId: TId, cart: IOrderState['cart']) => {
  const item = cart.find((cartItem) => cartItem.productId === productId);
  return !!item;
};

export const hasProductVariationInCartFn = (variationId: TId, cart: IOrderState['cart']) => {
  const item = cart.find((cartItem) => cartItem.productVariationId === variationId);
  return !!item;
};

export const cartItemFn = (productId: TId, variationId: TId, cart: IOrderState['cart']) => {
  return cart.find((cartItem) => cartItem.productId === productId && cartItem.productVariationId === variationId);
};

export const cartItemIdxFn = (productId: TId, variationId: TId, cart: IOrderState['cart']) => {
  return cart.findIndex((cartItem) => cartItem.productId === productId && cartItem.productVariationId === variationId);
};

export const productSalePriceWithDiscountFn = (
  costPrice: number,
  salePrice: number,
  discount?: IProductVariation['discount'],
) => {
  if (!discount || !discount.amount) return 0;

  const profit = salePrice - costPrice;
  let discountSalePrice = salePrice;
  const { type, amount } = discount;

  if (type === ENUM_PRODUCT_DISCOUNT_TYPES.FIXED) {
    discountSalePrice = salePrice - amount;
  } else if (type === ENUM_PRODUCT_DISCOUNT_TYPES.PERCENTAGE) {
    discountSalePrice = costPrice + profit * (1 - amount / 100);
  }

  if (discountSalePrice === salePrice) {
    return 0;
  }

  return Math.max(costPrice, discountSalePrice);
};

export const hasProductInWishlistFn = (productId: TId, wishlist: IOrderState['cart']) => {
  const item = wishlist.find((wishlistItem) => wishlistItem.productId === productId);
  return !!item;
};

export const wishlistItemIdxFn = (productId: TId, wishlist: IOrderState['cart']) => {
  return wishlist.findIndex((wishlistItem) => wishlistItem.productId === productId);
};
