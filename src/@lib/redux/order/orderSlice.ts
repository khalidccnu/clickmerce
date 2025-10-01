import { TId } from '@base/interfaces';
import { ICoupon } from '@modules/coupons/lib/interfaces';
import { ENUM_POS_DISCOUNT_TYPES, TPosDiscountType } from '@modules/pos/lib/enums';
import { ISettingsTax, ISettingsVat } from '@modules/settings/lib/interfaces';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { message } from 'antd';
import { loadOrderCustomerId, loadOrderVatTax } from './orderThunks';

interface IOrderCartItem {
  productId: TId;
  productVariationId: TId;
  selectedQuantity?: number;
  priority?: number;
}

interface IOrderCartProduct {
  productId: TId;
  productVariationId: TId;
  selectedQuantity: number;
  costPrice: number;
  salePrice: number;
}

export interface IOrderState {
  customerId: TId;
  cart: IOrderCartItem[];
  cartProducts: IOrderCartProduct[];
  coupon: ICoupon;
  discountType: TPosDiscountType;
  discount: number;
  vat: ISettingsVat;
  tax: ISettingsTax;
  isRoundOff: boolean;
  payableAmount: number;
}

const initialState: IOrderState = {
  customerId: null,
  cart: [],
  cartProducts: [],
  coupon: null,
  discountType: ENUM_POS_DISCOUNT_TYPES.FIXED,
  discount: 0,
  vat: null,
  tax: null,
  isRoundOff: true,
  payableAmount: 0,
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    setCustomerId: (state, action: PayloadAction<TId>) => {
      state.customerId = action.payload;
    },

    addToCartFn: (state, action: PayloadAction<{ item: IOrderCartItem }>) => {
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

    updateCartFn: (state, action: PayloadAction<{ item: IOrderCartItem }>) => {
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

    removeFromCartFn: (state, action: PayloadAction<{ item: IOrderCartItem }>) => {
      const { item } = action.payload;

      state.cart = state.cart.filter(
        (cartItem) =>
          !(cartItem.productId === item.productId && cartItem.productVariationId === item.productVariationId),
      );
      message.info('Successfully removed from the cart!');
    },

    clearCartFn: (state) => {
      message.info('Cart cleared!');
      return { ...initialState, customerId: state.customerId };
    },

    clearOrderFn: () => initialState,

    setCartProducts: (state, action: PayloadAction<IOrderCartProduct[]>) => {
      state.cartProducts = action.payload;
    },

    setCoupon: (state, action: PayloadAction<ICoupon>) => {
      state.coupon = action.payload;
    },

    setDiscount: (state, action: PayloadAction<{ type: TPosDiscountType; amount: number }>) => {
      const { type, amount } = action.payload;

      state.discountType = type;
      state.discount = amount;
    },

    setRoundOff: (state, action: PayloadAction<{ isRoundOff: boolean }>) => {
      const { isRoundOff } = action.payload;
      state.isRoundOff = isRoundOff;
    },

    setPayableAmount: (state, action: PayloadAction<{ amount: number }>) => {
      const { amount } = action.payload;
      state.payableAmount = amount;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loadOrderCustomerId.fulfilled, (state, action) => {
      const { customerId } = action.payload;

      state.customerId = customerId;
    });

    builder.addCase(loadOrderVatTax.fulfilled, (state, action) => {
      const { vat, tax } = action.payload;

      state.vat = vat;
      state.tax = tax;
    });
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
  setCoupon,
  setDiscount,
  setRoundOff,
  setPayableAmount,
} = orderSlice.actions;
export default orderSlice.reducer;
