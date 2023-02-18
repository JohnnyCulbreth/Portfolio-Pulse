const asyncHandler = require('express-async-handler');

// @description - Get tickers
// @route - GET /api/tickers
// @access - Private

const getTickers = asyncHandler(async (req, res) => {
  res.status(200).json({ message: 'Get Ticker' });
});

// @description - Set tickers
// @route - POST /api/tickers
// @access - Private

const setTicker = asyncHandler(async (req, res) => {
  if (!req.body.text) {
    res.status(400);
    throw new Error('Please add a text field');
  }

  res.status(200).json({ message: 'Set Ticker' });
});

// @description - Update tickers
// @route - PUT /api/tickers/:id
// @access - Private

const updateTickers = asyncHandler(async (req, res) => {
  res.status(200).json({ message: `Update ticker ${req.params.id}` });
});

// @description - Delete tickers
// @route - DELETE /api/tickers/:id
// @access - Private

const deleteTicker = asyncHandler(async (req, res) => {
  res.status(200).json({ message: `Delete ticker ${req.params.id}` });
});

module.exports = {
  getTickers,
  setTicker,
  updateTickers,
  deleteTicker,
};
