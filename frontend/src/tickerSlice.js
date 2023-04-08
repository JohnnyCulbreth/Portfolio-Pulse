import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import tickerService from './tickerService';

const initialState = {
  tickers: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

export const addTicker = createAsyncThunk(
  'tickers/add',
  async (tickerData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await tickerService.addTicker(tickerData, token);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getTickers = createAsyncThunk(
  'tickers/getAll',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await tickerService.getTickers(token);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const tickerSlice = createSlice({
  name: 'ticker',
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(addTicker.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addTicker.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.tickers.push(action.payload);
      })
      .addCase(addTicker.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getTickers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getTickers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.tickers = action.payload;
      })
      .addCase(getTickers.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = tickerSlice.actions;
export default tickerSlice.reducer;
