import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice.ts';
import transactionReducer from './slices/transactionSlice.ts';
import spendingLimitsReducer from './slices/spendingLimitsSlice.ts';
import goalsReducer from './slices/goalsSlice.ts';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    transactions: transactionReducer,
    spendingLimits: spendingLimitsReducer,
    goals: goalsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;