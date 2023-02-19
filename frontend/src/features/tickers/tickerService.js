import axios from 'axios';

const API_URL = '/api/tickers/';

// Create new ticker
const createTicker = async (tickerData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.post(API_URL, tickerData, config);

  return response.data;
};

// Get user tickers
const getTickers = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.get(API_URL, config);

  return response.data;
};

// Delete user ticker
const deleteTicker = async (tickerId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.delete(API_URL + tickerId, config);

  return response.data;
};

const tickerService = {
  createTicker,
  getTickers,
  deleteTicker,
};

export default tickerService;
