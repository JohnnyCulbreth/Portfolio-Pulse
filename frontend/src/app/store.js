import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import tickerSlice from '../tickerSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ticker: tickerSlice.reducer,
  },
});
