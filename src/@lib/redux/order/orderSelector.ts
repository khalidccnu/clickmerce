import { RootState } from '@lib/redux/store';
import { ENUM_COUPON_TYPES } from '@modules/coupons/lib/enums';
import { cartItemFn, productSalePriceWithDiscountFn } from '@modules/orders/lib/utils';
import { ENUM_PRODUCT_DISCOUNT_TYPES } from '@modules/products/lib/enums';
import { ENUM_SETTINGS_TAX_TYPES, ENUM_SETTINGS_VAT_TYPES } from '@modules/settings/lib/enums';
import { createSelector } from '@reduxjs/toolkit';
import { message } from 'antd';
import dayjs from 'dayjs';

const orderState = (state: RootState) => state.orderSlice;

export const orderSubtotalSnap = createSelector([orderState], (edge) => {
  const subTotalCost = edge.cartProducts.reduce(
    (sum, cartProduct) => sum + cartProduct.costPrice * cartProduct.selectedQuantity,
    0,
  );

  const subTotalSale = edge.cartProducts.reduce((sum, cartProduct) => {
    let price = 0;
    const cartItem = cartItemFn(cartProduct.productId, cartProduct.productVariationId, edge.cart);

    if (cartItem) {
      price = productSalePriceWithDiscountFn(cartProduct.costPrice, cartProduct.salePrice, cartItem.discount);
    }

    return sum + price * cartProduct.selectedQuantity;
  }, 0);

  return { subTotalCost, subTotalSale };
});

export const orderCouponSnap = createSelector([orderState, orderSubtotalSnap], (edge, subtotalSnap) => {
  const coupon = edge.coupon;

  if (!coupon) return 0;

  const now = dayjs();
  const validFrom = dayjs(coupon.valid_from);
  const validUntil = dayjs(coupon.valid_until);
  if ((validFrom && now.isBefore(validFrom)) || (validUntil && now.isAfter(validUntil))) {
    message.error('Coupon is not valid at this time!');
    return 0;
  }

  const { subTotalSale } = subtotalSnap;

  if (coupon.min_purchase_amount && subTotalSale < coupon.min_purchase_amount) {
    message.error('Minimum purchase amount not met!');
    return 0;
  }

  if (coupon.usage_limit && coupon.usage_count >= coupon.usage_limit) {
    message.error('Coupon usage limit reached!');
    return 0;
  }

  let couponAmount = 0;

  if (coupon.type === ENUM_COUPON_TYPES.FIXED) {
    couponAmount = coupon.amount;
  } else {
    couponAmount = (subTotalSale * coupon.amount) / 100;
  }

  if (coupon.max_redeemable_amount && couponAmount > coupon.max_redeemable_amount) {
    couponAmount = coupon.max_redeemable_amount;
  }

  return couponAmount;
});

export const orderDiscountSnap = createSelector([orderState, orderSubtotalSnap], (edge, subtotalSnap) => {
  const { type, amount } = edge.discount;

  if (!amount) return 0;

  const { subTotalSale } = subtotalSnap;

  let discountAmount = 0;

  if (type === ENUM_PRODUCT_DISCOUNT_TYPES.FIXED) {
    discountAmount = amount;
  } else {
    discountAmount = (subTotalSale * amount) / 100;
  }

  return discountAmount;
});

export const orderRedeemSnap = createSelector(
  [orderSubtotalSnap, orderCouponSnap, orderDiscountSnap],
  (subtotalSnap, couponSnap, discountSnap) => {
    const { subTotalCost, subTotalSale } = subtotalSnap;
    const profit = Math.max(0, subTotalSale - subTotalCost);
    const totalRedeem = couponSnap + discountSnap;

    if (totalRedeem <= profit) {
      return {
        couponAmount: couponSnap,
        discountAmount: discountSnap,
        redeemAmount: totalRedeem,
        isAdjusted: false,
      };
    }

    const couponProportion = totalRedeem ? couponSnap / totalRedeem : 0;
    const discountProportion = totalRedeem ? discountSnap / totalRedeem : 0;

    const couponAmount = profit * couponProportion;
    const discountAmount = profit * discountProportion;

    return {
      couponAmount: Math.max(0, couponAmount),
      discountAmount: Math.max(0, discountAmount),
      redeemAmount: profit,
      isAdjusted: true,
    };
  },
);

export const orderVatSnap = createSelector([orderState, orderSubtotalSnap], (edge, subtotalSnap) => {
  if (!edge.vat) return 0;

  const { type, amount } = edge.vat;
  const { subTotalSale } = subtotalSnap;

  if (type === ENUM_SETTINGS_VAT_TYPES.PERCENTAGE) {
    return (subTotalSale * amount) / 100;
  }

  return amount;
});

export const orderTaxSnap = createSelector([orderState, orderSubtotalSnap], (edge, subtotalSnap) => {
  if (!edge.tax) return 0;

  const { type, amount } = edge.tax;
  const { subTotalSale } = subtotalSnap;

  if (type === ENUM_SETTINGS_TAX_TYPES.PERCENTAGE) {
    return (subTotalSale * amount) / 100;
  }

  return amount;
});

export const orderGrandTotalSnap = createSelector(
  [orderState, orderSubtotalSnap, orderRedeemSnap, orderVatSnap, orderTaxSnap],
  (edge, subtotalSnap, redeemSnap, vatSnap, taxSnap) => {
    const { subTotalCost, subTotalSale } = subtotalSnap;
    const { redeemAmount, isAdjusted } = redeemSnap;

    const profit = subTotalSale - subTotalCost;
    const isRedeemExceedingProfit = isAdjusted;

    const totalSale = subTotalSale + vatSnap + taxSnap + edge.deliveryCharge - redeemAmount;
    const totalSaleWithRoundOff = edge.isRoundOff ? Math.round(totalSale) : totalSale;

    return {
      totalSale,
      totalSaleWithRoundOff,
      totalRedeem: redeemAmount,
      isRedeemExceedingProfit,
      availableProfit: profit,
    };
  },
);

export const orderRoundOffSnap = createSelector([orderGrandTotalSnap], (grandTotalSnap) => {
  const { totalSale } = grandTotalSnap;
  return Math.round(totalSale) - totalSale;
});

export const orderProfitSnap = createSelector([orderSubtotalSnap, orderRedeemSnap], (subtotalSnap, redeemSnap) => {
  const { subTotalCost, subTotalSale } = subtotalSnap;
  const { redeemAmount, isAdjusted } = redeemSnap;

  const profit = Math.max(0, subTotalSale - subTotalCost);
  const remainingProfit = Math.max(0, profit - redeemAmount);
  const profitUtilization = profit ? (redeemAmount / profit) * 100 : 0;

  return {
    profit,
    totalRedeem: redeemAmount,
    remainingProfit,
    profitUtilization,
    isProfitFullyUtilized: profitUtilization >= 100,
    isAdjusted,
  };
});

export const orderChangeAmountSnap = createSelector([orderState, orderGrandTotalSnap], (edge, grandTotalSnap) => {
  const { totalSaleWithRoundOff } = grandTotalSnap;
  return edge.payableAmount && edge.payableAmount > totalSaleWithRoundOff
    ? edge.payableAmount - totalSaleWithRoundOff
    : 0;
});
