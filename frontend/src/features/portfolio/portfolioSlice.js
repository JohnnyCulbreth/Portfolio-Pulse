import { createSlice } from '@reduxjs/toolkit';

const initialState = [];

const portfolioSlice = createSlice({
  name: 'portfolio',
  initialState,
  reducers: {
    addPosition: (state, action) => {
      state.push(action.payload);
    },
    updatePosition: (state, action) => {
      const { id, newData } = action.payload;
      const index = state.findIndex((position) => position.id === id);
      if (index !== -1) {
        state[index] = { ...state[index], ...newData };
      }
    },
    deletePosition: (state, action) => {
      const index = state.findIndex(
        (position) => position.id === action.payload
      );
      if (index !== -1) {
        state.splice(index, 1);
      }
    },
  },
});

export const { addPosition, updatePosition, deletePosition } =
  portfolioSlice.actions;

export default portfolioSlice.reducer;
