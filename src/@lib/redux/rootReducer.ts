import { combineReducers } from '@reduxjs/toolkit';
import { PersistConfig, persistReducer } from 'redux-persist';
import orderSlice from './order/orderSlice';
import { storage } from './storage';

const rootReducer = combineReducers({ orderSlice });

const rootPersistConfig: PersistConfig<Partial<keyof typeof rootReducer>> = {
  key: 'root',
  storage,
};

export const persistedReducer = persistReducer(rootPersistConfig, rootReducer);
