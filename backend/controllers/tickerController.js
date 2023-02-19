const asyncHandler = require('express-async-handler');
const { tick } = require('mongoose/lib/utils');

const Ticker = require('../models/tickerModel');
const User = require('../models/userModel');

// @description - Get tickers
// @route - GET /api/tickers
// @access - Private

const getTickers = asyncHandler(async (req, res) => {
  const tickers = await Ticker.find({ user: req.user.id });

  res.status(200).json(tickers);
});

// @description - Set tickers
// @route - POST /api/tickers
// @access - Private

const setTicker = asyncHandler(async (req, res) => {
  if (!req.body.text) {
    res.status(400);
    throw new Error('Please add a text field');
  }
  const ticker = await Ticker.create({
    text: req.body.text,
    user: req.user.id,
  });

  res.status(200).json(ticker);
});

// @description - Update tickers
// @route - PUT /api/tickers/:id
// @access - Private

const updateTickers = asyncHandler(async (req, res) => {
  const ticker = await Ticker.findById(req.params.id);

  if (!ticker) {
    res.status(400);
    throw new Error('Ticker not found');
  }

  const user = await User.findById(req.user.id);

  // Check for user
  if (!user) {
    res.status(401);
    throw new Error('User not found');
  }

  // Make sure the logged in user matches the ticker user
  if (ticker.user.toString() !== user.id) {
    res.status(401);
    throw new Error('User not authorized');
  }

  const updatedTicker = await Ticker.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.status(200).json(updatedTicker);
});

// @description - Delete tickers
// @route - DELETE /api/tickers/:id
// @access - Private

const deleteTicker = asyncHandler(async (req, res) => {
  const ticker = await Ticker.findById(req.params.id);

  if (!ticker) {
    res.status(400);
    throw new Error('Ticker not found');
  }

  const user = await User.findById(req.user.id);

  // Check for user
  if (!user) {
    res.status(401);
    throw new Error('User not found');
  }

  // Make sure the logged in user matches the ticker user
  if (ticker.user.toString() !== user.id) {
    res.status(401);
    throw new Error('User not authorized');
  }

  await ticker.remove();

  res.status(200).json({ id: req.params.id });
});

module.exports = {
  getTickers,
  setTicker,
  updateTickers,
  deleteTicker,
};
