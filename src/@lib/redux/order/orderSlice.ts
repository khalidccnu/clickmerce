import { TId } from '@base/interfaces';
import { ICoupon } from '@modules/coupons/lib/interfaces';
import { ENUM_PRODUCT_DISCOUNT_TYPES, TProductDiscountType } from '@modules/products/lib/enums';
import { IProductVariation } from '@modules/products/lib/interfaces';
import { ISettingsTax, ISettingsVat } from '@modules/settings/lib/interfaces';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { message } from 'antd';
import { loadOrderCustomerId, loadOrderPaymentMethodId, loadOrderVatTax } from './orderThunks';
import { cartItemIdxFn } from './utils';

interface IOrderCartItem {
  productId: TId;
  productVariationId: TId;
  selectedQuantity?: number;
  discount?: IProductVariation['discount'];
  priority?: number;
}

interface IOrderCartProduct {
  productId: TId;
  productVariationId: TId;
  selectedQuantity: number;
  costPrice: number;
  salePrice: number;
  discount?: IProductVariation['discount'];
}

export interface IOrderState {
  customerId: TId;
  cart: IOrderCartItem[];
  cartProducts: IOrderCartProduct[];
  coupon: ICoupon;
  discount: IProductVariation['discount'];
  vat: ISettingsVat;
  tax: ISettingsTax;
  deliveryCharge: number;
  isRoundOff: boolean;
  payableAmount: number;
  paymentMethodId: TId;
  deliveryZoneId: TId;
}

const initialState: IOrderState = {
  customerId: null,
  cart: [],
  cartProducts: [],
  coupon: null,
  discount: { type: ENUM_PRODUCT_DISCOUNT_TYPES.FIXED, amount: 0 },
  vat: null,
  tax: null,
  deliveryCharge: 0,
  isRoundOff: true,
  payableAmount: 0,
  paymentMethodId: null,
  deliveryZoneId: null,
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

      const itemIdx = cartItemIdxFn(item.productId, item.productVariationId, state.cart);
      const lastPriority = state.cart.length
        ? state.cart.reduce((max, cartItem) => Math.max(max, cartItem.priority || 0), 0)
        : 0;
      const priority = lastPriority + 1;

      if (itemIdx === -1) {
        state.cart.push({ ...item, priority });
        message.info('Successfully added to the cart!');
        return;
      }

      const { selectedQuantity, discount } = item;

      if (!selectedQuantity && !discount) {
        return;
      }

      if (selectedQuantity) {
        state.cart[itemIdx].selectedQuantity = selectedQuantity;
        state.cartProducts[itemIdx].selectedQuantity = selectedQuantity;
      }

      if (discount) {
        state.cart[itemIdx].discount = discount;
        state.cartProducts[itemIdx].discount = discount;
      }
    },

    updateCartFn: (state, action: PayloadAction<{ item: IOrderCartItem }>) => {
      const {
        item: { productId, productVariationId, selectedQuantity, discount },
      } = action.payload;

      const itemIdx = cartItemIdxFn(productId, productVariationId, state.cart);

      if (itemIdx === -1) {
        message.error('Not found in the cart!');
        return;
      }

      if (!selectedQuantity && !discount) {
        return;
      }

      if (selectedQuantity) {
        state.cart[itemIdx].selectedQuantity = selectedQuantity;
        state.cartProducts[itemIdx].selectedQuantity = selectedQuantity;
      }

      if (discount) {
        state.cart[itemIdx].discount = discount;
        state.cartProducts[itemIdx].discount = discount;
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
      return { ...initialState, customerId: state.customerId, paymentMethodId: state.paymentMethodId };
    },

    clearOrderFn: () => initialState,

    setCartProducts: (state, action: PayloadAction<IOrderCartProduct[]>) => {
      state.cartProducts = action.payload;
    },

    setCoupon: (state, action: PayloadAction<ICoupon>) => {
      state.coupon = action.payload;
    },

    setDiscount: (state, action: PayloadAction<{ type: TProductDiscountType; amount: number }>) => {
      const { type, amount } = action.payload;
      state.discount = { type, amount };
    },

    setDeliveryCharge: (state, action: PayloadAction<number>) => {
      state.deliveryCharge = action.payload;
    },

    setRoundOff: (state, action: PayloadAction<{ isRoundOff: boolean }>) => {
      const { isRoundOff } = action.payload;
      state.isRoundOff = isRoundOff;
    },

    setPayableAmount: (state, action: PayloadAction<{ amount: number }>) => {
      const { amount } = action.payload;
      state.payableAmount = amount;
    },

    setPaymentMethodId: (state, action: PayloadAction<TId>) => {
      state.paymentMethodId = action.payload;
    },

    setDeliveryZoneId: (state, action: PayloadAction<TId>) => {
      state.deliveryZoneId = action.payload;
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

    builder.addCase(loadOrderPaymentMethodId.fulfilled, (state, action) => {
      const { paymentMethodId } = action.payload;
      state.paymentMethodId = paymentMethodId;
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
  setDeliveryCharge,
  setRoundOff,
  setPayableAmount,
  setPaymentMethodId,
  setDeliveryZoneId,
} = orderSlice.actions;
export default orderSlice.reducer;
