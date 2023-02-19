import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import tickerReducer from '../features/tickers/tickerSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    tickers: tickerReducer,
  },
});
