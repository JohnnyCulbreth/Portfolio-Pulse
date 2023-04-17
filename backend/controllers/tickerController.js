const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const Ticker = require('../models/tickerModel');
const axios = require('axios');

// FETCH Stock info
const fetchStockInfo = async (stockSymbol) => {
  // const API_KEY = process.env.REACT_APP_IEX_API_KEY;
  const API_KEY = 'pk_c227bbfffc334f619036e0e3d8679fb5';
  const url = `https://cloud.iexapis.com/stable/stock/${stockSymbol}/quote?token=${API_KEY}`;
  const response = await axios.get(url);
  return response.data;
};

// @desc    Add a new ticker to user's portfolio
// @route   POST /api/tickers
// @access  Private
const addTicker = asyncHandler(async (req, res) => {
  const { ticker, entryPrice, numShares } = req.body;
  const { _id: userId } = req.user; // get user id from authenticated user

  const user = await User.findById(userId);

  const tickerObj = new Ticker({
    user: req.user._id,
    ticker,
    entryPrice,
    numShares,
  });

  const savedTicker = await tickerObj.save();
  const stockInfo = await fetchStockInfo(savedTicker.ticker);
  console.log(stockInfo);

  if (!stockInfo || stockInfo.companyName === '') {
    res.status(400);
    throw new Error('Invalid ticker');
  }

  const newTicker = {
    user: userId,
    ticker: savedTicker.ticker,
    entryPrice: savedTicker.entryPrice,
    numShares: savedTicker.numShares,
    stockInfo,
  };

  user.portfolio.push(newTicker);
  await user.save();

  res.status(201).json(newTicker);
});

module.exports = { addTicker };

// @desc    Get all tickers in user's portfolio
// @route   GET /api/tickers
// @access  Private
const getTickers = asyncHandler(async (req, res) => {
  const { user } = req;

  const tickers = await Ticker.find({ user: user._id });

  res.json(tickers);
});

// @desc    Get a ticker by id
// @route   GET /api/tickers/:id
// @access  Private
const getTickerById = asyncHandler(async (req, res) => {
  const { user } = req;
  const { id } = req.params;

  const ticker = await Ticker.findOne({ _id: id, user: user._id });

  if (!ticker) {
    res.status(404);
    throw new Error('Ticker not found');
  }

  res.json(ticker);
});

// OR?

const getTickerInfo = async (req, res, next) => {
  const { symbol } = req.params;

  try {
    const response = await axios.get(
      `https://api.iextrading.com/1.0/stock/${symbol}/batch?types=quote,news,chart&range=1m&last=1`
    );

    res.status(200).json(response.data);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a ticker in user's portfolio
// @route   PUT /api/tickers/:id
// @access  Private
const updateTicker = asyncHandler(async (req, res) => {
  const { user } = req;
  const { id } = req.params;
  const { ticker, entryPrice, numShares } = req.body;

  const tickerToUpdate = await Ticker.findOne({ _id: id, user: user._id });

  if (!tickerToUpdate) {
    res.status(404);
    throw new Error('Ticker not found');
  }

  tickerToUpdate.ticker = ticker || tickerToUpdate.ticker;
  tickerToUpdate.entryPrice = entryPrice || tickerToUpdate.entryPrice;
  tickerToUpdate.numShares = numShares || tickerToUpdate.numShares;

  const updatedTicker = await tickerToUpdate.save();

  res.json(updatedTicker);
});

// @desc    Delete a ticker from user's portfolio
// @route   DELETE /api/tickers/:id
// @access  Private
const deleteTicker = asyncHandler(async (req, res) => {
  const { user } = req;
  const { ticker } = req.params;

  const tickerToDelete = await Ticker.findOne({
    ticker: { $regex: `^${ticker}$`, $options: 'i' },
    user: user._id,
  });

  if (!tickerToDelete) {
    res.status(404);
    throw new Error('Ticker not found');
  }

  // Remove the ticker from the Ticker collection
  await tickerToDelete.remove();
  console.log('Ticker removed:', tickerToDelete);

  // Remove the ticker from the user's portfolio array
  const userToUpdate = await User.findById(user._id);
  userToUpdate.portfolio = userToUpdate.portfolio.filter(
    (item) => item.ticker !== tickerToDelete.ticker
  );
  await userToUpdate.save();

  res.json({ message: 'Ticker removed from portfolio' });
});

module.exports = {
  addTicker,
  getTickers,
  getTickerInfo,
  getTickerById,
  updateTicker,
  deleteTicker,
};
