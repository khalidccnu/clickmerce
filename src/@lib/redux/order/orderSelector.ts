import { RootState } from '@lib/redux/store';
import { ENUM_COUPON_TYPES } from '@modules/coupons/lib/enums';
import { ENUM_POS_DISCOUNT_TYPES } from '@modules/pos/lib/enums';
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

  const subTotalSale = edge.cartProducts.reduce(
    (sum, cartProduct) => sum + cartProduct.salePrice * cartProduct.selectedQuantity,
    0,
  );

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

  if (coupon.max_redeemable_amount) {
    if (coupon.type === ENUM_COUPON_TYPES.FIXED && coupon.amount > coupon.max_redeemable_amount) {
      message.info('Maximum redeemable amount exceeded!');
      return coupon.max_redeemable_amount;
    }

    if (coupon.type === ENUM_COUPON_TYPES.PERCENTAGE) {
      const percentAmount = (subTotalSale * coupon.amount) / 100;

      if (percentAmount > coupon.max_redeemable_amount) {
        message.info('Maximum redeemable amount exceeded!');
        return coupon.max_redeemable_amount;
      }
    }
  }

  if (coupon.usage_limit && coupon.usage_count >= coupon.usage_limit) {
    message.error('Coupon usage limit reached!');
    return 0;
  }

  if (coupon.type === ENUM_COUPON_TYPES.FIXED) return coupon.amount;
  return (subTotalSale * coupon.amount) / 100;
});

export const orderDiscountSnap = createSelector([orderState, orderSubtotalSnap], (edge, subtotalSnap) => {
  if (!edge.discount) return 0;
  if (edge.discountType === ENUM_POS_DISCOUNT_TYPES.FIXED) return edge.discount;

  const { subTotalSale } = subtotalSnap;

  return (subTotalSale * edge.discount) / 100;
});

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
  [orderState, orderSubtotalSnap, orderCouponSnap, orderDiscountSnap, orderVatSnap, orderTaxSnap],
  (edge, subtotalSnap, couponSnap, discountSnap, vatSnap, taxSnap) => {
    const { subTotalCost, subTotalSale } = subtotalSnap;

    const profit = subTotalSale - subTotalCost;
    let totalDiscount = couponSnap + discountSnap;

    if (totalDiscount > profit) {
      totalDiscount = profit;
    }

    const total = subTotalSale - totalDiscount + vatSnap + taxSnap;
    const totalWithRoundOff = edge.isRoundOff ? Math.round(total) : total;

    return { total, totalWithRoundOff };
  },
);

export const orderRoundOffSnap = createSelector([orderGrandTotalSnap], (grandTotalSnap) => {
  const { total } = grandTotalSnap;
  return Math.round(total) - total;
});

export const orderChangeAmountSnap = createSelector([orderState, orderGrandTotalSnap], (edge, grandTotalSnap) => {
  const { totalWithRoundOff } = grandTotalSnap;
  return edge.payableAmount && edge.payableAmount > totalWithRoundOff ? edge.payableAmount - totalWithRoundOff : 0;
});
