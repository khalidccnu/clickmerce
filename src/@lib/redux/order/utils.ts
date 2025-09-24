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
