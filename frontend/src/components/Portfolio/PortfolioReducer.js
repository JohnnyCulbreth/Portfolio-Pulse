import { createReducer } from '@reduxjs/toolkit';
import { addStock, removeStock } from './PortfolioActions';

const initialState = {
  ticker: '',
  entryPrice: 0,
  numShares: 0,
  portfolio: [],
};

const portfolioReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(addStock, (state, action) => {
      // handle adding a stock to the portfolio
    })
    .addCase(removeStock, (state, action) => {
      // handle removing a stock from the portfolio
    });
});

export default portfolioReducer;
