const mongoose = require('mongoose');

const tickerSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  ticker: {
    type: String,
    required: true,
  },
  entryPrice: {
    type: Number,
    required: true,
  },
  numShares: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model('Ticker', tickerSchema);
