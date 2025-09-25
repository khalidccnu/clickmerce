import { RootState } from '@lib/redux/store';
import { createSelector } from '@reduxjs/toolkit';

const orderState = (state: RootState) => state.orderSlice;

export const orderCartSubtotalSnap = createSelector([orderState], (edge) =>
  edge.cartProducts.reduce((sum, cartProduct) => sum + cartProduct.price * cartProduct.selectedQuantity, 0),
);

export const orderDiscountSnap = createSelector([orderState, orderCartSubtotalSnap], (edge, subtotalSnap) => {
  if (!edge.discount) return 0;
  if (edge.discountType === 'fixed') return edge.discount;

  return (subtotalSnap * edge.discount) / 100;
});
