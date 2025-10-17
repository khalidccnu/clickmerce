import { TId } from '@base/interfaces';
import { ENUM_PRODUCT_DISCOUNT_TYPES } from '@modules/products/lib/enums';
import { IProductVariation } from '@modules/products/lib/interfaces';
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

export const productSalePriceWithDiscountFn = (
  costPrice: number,
  salePrice: number,
  discount: IProductVariation['discount'],
) => {
  if (!discount?.amount) return salePrice;

  let discountSalePrice = 0;
  const { type, amount } = discount;

  if (type && amount) {
    if (type === ENUM_PRODUCT_DISCOUNT_TYPES.FIXED) {
      discountSalePrice = salePrice - amount;
    } else if (type === ENUM_PRODUCT_DISCOUNT_TYPES.PERCENTAGE) {
      discountSalePrice = salePrice * (1 - amount / 100);
    }
  }

  return Math.max(costPrice, discountSalePrice || salePrice);
};
