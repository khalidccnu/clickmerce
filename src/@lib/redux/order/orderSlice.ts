import { TId } from '@base/interfaces';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { message } from 'antd';

interface ICartItem {
  id: TId;
  selectedQuantity: number;
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

      const itemIdx = state.cart.findIndex((cartItem) => cartItem.id === item.id);
      const lastPriority = state.cart.length
        ? state.cart.reduce((max, cartItem) => Math.max(max, cartItem.priority), 0)
        : 0;
      const priority = lastPriority + 1;

      if (itemIdx === -1) {
        state.cart.push({ ...item, priority });
        message.info('Successfully added to the cart!');
      } else {
        state.cart[itemIdx].selectedQuantity += item.selectedQuantity;
      }
    },
  },
});

export const { setCustomer, addToCartFn } = orderSlice.actions;
export default orderSlice.reducer;
