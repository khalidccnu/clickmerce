import { Env } from '.environments';
import { configureStore } from '@reduxjs/toolkit';
import { FLUSH, PAUSE, PERSIST, persistStore, PURGE, REGISTER, REHYDRATE } from 'redux-persist';
import middleware from './middleware';
import { persistedReducer } from './rootReducer';

export const initializeRedux = () => {
  const store = configureStore({
    reducer: persistedReducer,
    devTools: Env.isProduction,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }).concat(...middleware),
  });

  const persistor = persistStore(store);

  return { store, persistor };
};

const isClient = typeof window !== 'undefined';
export const store = isClient ? initializeRedux().store : null;
export const persistor = isClient ? initializeRedux().persistor : null;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = (dispatch: AppDispatch, getState: () => RootState) => ReturnType;
