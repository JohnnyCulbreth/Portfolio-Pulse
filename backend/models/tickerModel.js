const mongoose = require('mongoose');

const tickerSchema = mongoose.Schema(
  {
    text: {
      type: String,
      required: [true, 'Please add a Ticker'],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Ticker', tickerSchema);
