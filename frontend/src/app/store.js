import { configureStore, combineReducers } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import portfolioReducer from '../features/portfolio/portfolioSlice';
import axios from 'axios';

const rootReducer = combineReducers({
  portfolio: portfolioReducer,
});

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ...rootReducer,
  },
});

// Define the actions
export const addPosition = (position) => ({
  type: 'ADD_POSITION',
  payload: position,
});

export const updatePosition = (position) => ({
  type: 'UPDATE_POSITION',
  payload: position,
});

export const deletePosition = (id) => ({
  type: 'DELETE_POSITION',
  payload: id,
});

export const setPositions = (positions) => ({
  type: 'SET_POSITIONS',
  payload: positions,
});

// Define the async action creators
export const fetchPositions = () => async (dispatch) => {
  try {
    const res = await axios.get('/positions');
    const positions = res.data;
    dispatch(setPositions(positions));
  } catch (err) {
    console.log(err);
  }
};

export const createPosition = (positionData) => async (dispatch) => {
  try {
    const res = await axios.post('/positions', positionData);
    const newPosition = res.data;
    dispatch(addPosition(newPosition));
  } catch (err) {
    console.log(err);
  }
};

export const updatePositionById = (id, positionData) => async (dispatch) => {
  try {
    const res = await axios.patch(`/positions/${id}`, positionData);
    const updatedPosition = res.data;
    dispatch(updatePosition(updatedPosition));
  } catch (err) {
    console.log(err);
  }
};

export const deletePositionById = (id) => async (dispatch) => {
  try {
    await axios.delete(`/positions/${id}`);
    dispatch(deletePosition(id));
  } catch (err) {
    console.log(err);
  }
};
