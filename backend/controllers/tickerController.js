const asyncHandler = require('express-async-handler');
const Ticker = require('../models/tickerModel');

// @desc    Add a new ticker to user's portfolio
// @route   POST /api/tickers
// @access  Private
const addTicker = asyncHandler(async (req, res) => {
  const { user } = req;
  const { ticker, entryPrice, numShares } = req.body;

  const tickerExists = await Ticker.findOne({ user: user._id, ticker });

  if (tickerExists) {
    res.status(400);
    throw new Error('Ticker already exists in portfolio');
  }

  const tickerData = new Ticker({
    user: user._id,
    ticker,
    entryPrice,
    numShares,
  });

  const createdTicker = await tickerData.save();

  res.status(201).json(createdTicker);
});

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
  const { id } = req.params;

  const tickerToDelete = await Ticker.findOne({ _id: id, user: user._id });

  if (!tickerToDelete) {
    res.status(404);
    throw new Error('Ticker not found');
  }

  await tickerToDelete.remove();

  res.json({ message: 'Ticker removed from portfolio' });
});

module.exports = {
  addTicker,
  getTickers,
  getTickerById,
  updateTicker,
  deleteTicker,
};
