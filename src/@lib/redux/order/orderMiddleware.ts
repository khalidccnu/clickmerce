import { Middleware, MiddlewareAPI, PayloadAction } from '@reduxjs/toolkit';
import { setCartProducts } from '../order/orderSlice';
import { AppDispatch, RootState } from '../store';
import { loadOrderVatTax } from './orderThunks';

const orderMiddleware: Middleware =
  (store: MiddlewareAPI<AppDispatch, RootState>) => (next) => async (action: PayloadAction) => {
    if (action.type === setCartProducts.type) {
      await store.dispatch(loadOrderVatTax());
    }

    return next(action);
  };

export default orderMiddleware;
