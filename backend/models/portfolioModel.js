const mongoose = require('mongoose');

const positionSchema = new mongoose.Schema({
  ticker: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  cost: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model('Position', positionSchema);
