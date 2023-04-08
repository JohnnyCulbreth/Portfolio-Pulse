import axios from 'axios';

const API_URL = '/api/portfolio/';

const addTicker = async (tickerData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.post(API_URL, tickerData, config);

  return response.data;
};

const getTickers = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.get(API_URL, config);

  return response.data;
};

const tickerService = {
  addTicker,
  getTickers,
};

export default tickerService;
