import { TId } from '@base/interfaces';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { message } from 'antd';

interface ICartItem {
  productId: TId;
  productVariationId: TId;
  selectedQuantity?: number;
  priority?: number;
}

interface ICartProduct {
  productId: TId;
  productVariationId: TId;
  selectedQuantity: number;
  price: number;
}

export interface IOrderState {
  customerId: TId;
  cart: ICartItem[];
  cartProducts: ICartProduct[];
  discountType: 'fixed' | 'percentage';
  discount: number;
}

const initialState: IOrderState = {
  customerId: null,
  cart: [],
  cartProducts: [],
  discountType: 'fixed',
  discount: 0,
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    setCustomerId: (state, action: PayloadAction<TId>) => {
      state.customerId = action.payload;
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
        state.cartProducts[itemIdx].selectedQuantity += item.selectedQuantity;
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
        state.cartProducts[itemIdx].selectedQuantity = item.selectedQuantity;
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

    setCartProducts: (state, action: PayloadAction<ICartProduct[]>) => {
      state.cartProducts = action.payload;
    },

    setDiscount: (state, action: PayloadAction<{ type: 'fixed' | 'percentage'; amount: number }>) => {
      const { type, amount } = action.payload;

      state.discountType = type;
      state.discount = amount;
    },
  },
});

export const {
  setCustomerId,
  addToCartFn,
  updateCartFn,
  removeFromCartFn,
  clearCartFn,
  clearOrderFn,
  setCartProducts,
  setDiscount,
} = orderSlice.actions;
export default orderSlice.reducer;
