const express = require('express');
const router = express.Router();
const {
  getTickerInfo,
  addTicker,
  deleteTicker,
} = require('../controllers/tickerController');

const { protect } = require('../middleware/authMiddleware');

router.get('/:symbol', getTickerInfo);
router.post('/', protect, addTicker);
router.route('/:ticker').delete(protect, deleteTicker);

module.exports = router;
