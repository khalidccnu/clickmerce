import { TId } from '@base/interfaces';
import { IOrderState } from './orderSlice';

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
