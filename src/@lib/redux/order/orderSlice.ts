import { TId } from '@base/interfaces';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { message } from 'antd';

interface ICartItem {
  productId: TId;
  productVariationId: TId;
  selectedQuantity?: number;
  priority?: number;
}

export interface IOrderState {
  customer: TId;
  cart: ICartItem[];
}

const initialState: IOrderState = {
  customer: null,
  cart: [],
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    setCustomer: (state, action: PayloadAction<TId>) => {
      state.customer = action.payload;
    },

    addToCartFn: (state, action: PayloadAction<{ item: ICartItem }>) => {
      const { item } = action.payload;

      const itemIdx = state.cart.findIndex(
        (cartItem) =>
          cartItem?.productId === item?.productId && cartItem?.productVariationId === item?.productVariationId,
      );
      const lastPriority = state.cart.length
        ? state.cart.reduce((max, cartItem) => Math.max(max, cartItem.priority || 0), 0)
        : 0;
      const priority = lastPriority + 1;

      if (itemIdx === -1) {
        state.cart.push({ ...item, priority });
        message.info('Successfully added to the cart!');
      } else {
        state.cart[itemIdx].selectedQuantity += item.selectedQuantity;
      }
    },

    updateCartFn: (state, action: PayloadAction<{ item: ICartItem }>) => {
      const { item } = action.payload;

      const itemIdx = state.cart.findIndex(
        (cartItem) => cartItem.productId === item.productId && cartItem.productVariationId === item.productVariationId,
      );

      if (itemIdx === -1) {
        message.error('Not found in the cart!');
      } else {
        state.cart[itemIdx].selectedQuantity = item.selectedQuantity;
      }
    },

    removeFromCartFn: (state, action: PayloadAction<{ item: ICartItem }>) => {
      const { item } = action.payload;

      state.cart = state.cart.filter(
        (cartItem) =>
          !(cartItem.productId === item.productId && cartItem.productVariationId === item.productVariationId),
      );
      message.info('Successfully removed from the cart!');
    },

    clearCartFn: (state) => {
      state.cart = [];
      message.info('Cart cleared!');
    },

    clearOrderFn: () => initialState,
  },
});

export const { setCustomer, addToCartFn, updateCartFn, removeFromCartFn, clearCartFn, clearOrderFn } =
  orderSlice.actions;
export default orderSlice.reducer;
