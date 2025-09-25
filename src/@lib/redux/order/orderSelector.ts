import { RootState } from '@lib/redux/store';
import { ENUM_POS_DISCOUNT_TYPES } from '@modules/pos/lib/enums';
import { createSelector } from '@reduxjs/toolkit';

const orderState = (state: RootState) => state.orderSlice;

export const orderSubtotalSnap = createSelector([orderState], (edge) =>
  edge.cartProducts.reduce((sum, cartProduct) => sum + cartProduct.price * cartProduct.selectedQuantity, 0),
);

export const orderDiscountSnap = createSelector([orderState, orderSubtotalSnap], (edge, subtotalSnap) => {
  if (!edge.discount) return 0;
  if (edge.discountType === ENUM_POS_DISCOUNT_TYPES.FIXED) return edge.discount;

  return (subtotalSnap * edge.discount) / 100;
});

export const orderGrandTotalSnap = createSelector(
  [orderState, orderSubtotalSnap, orderDiscountSnap],
  (edge, subtotalSnap, discountSnap) => {
    const total = subtotalSnap - discountSnap;
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
