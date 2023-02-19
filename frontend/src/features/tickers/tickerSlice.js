import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import tickerService from './tickerService';

const initialState = {
  tickers: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

// Create new ticker
export const createTicker = createAsyncThunk(
  'tickers/create',
  async (tickerData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await tickerService.createTicker(tickerData, token);
    } catch (error) {
      const message =
        (error.response &&
          error.repsonse.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get user tickers
export const getTickers = createAsyncThunk(
  'tickers/getAll',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await tickerService.getTickers(token);
    } catch (error) {
      const message =
        (error.response &&
          error.repsonse.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Delete user ticker
export const deleteTicker = createAsyncThunk(
  'tickers/delete',
  async (id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await tickerService.deleteTicker(id, token);
    } catch (error) {
      const message =
        (error.response &&
          error.repsonse.data &&
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
      .addCase(createTicker.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createTicker.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.tickers.push(action.payload);
      })
      .addCase(createTicker.rejected, (state, action) => {
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
      })
      .addCase(deleteTicker.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteTicker.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.tickers = state.tickers.filter(
          (ticker) => ticker._id !== action.payload.id
        );
      })
      .addCase(deleteTicker.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = tickerSlice.actions;
export default tickerSlice.reducer;
