import { combineReducers } from '@reduxjs/toolkit';
import { PersistConfig, persistReducer } from 'redux-persist';
import orderSlice from './order/orderSlice';
import { storage } from './storage';

const orderPersistConfig: PersistConfig<Partial<keyof typeof orderSlice>> = {
  key: 'order',
  storage,
  whitelist: ['customerId', 'cart'],
};

const rootReducer = combineReducers({ orderSlice: persistReducer(orderPersistConfig, orderSlice) });

const rootPersistConfig: PersistConfig<Partial<keyof typeof rootReducer>> = {
  key: 'root',
  storage,
  whitelist: [],
};

export const persistedReducer = persistReducer(rootPersistConfig, rootReducer);
