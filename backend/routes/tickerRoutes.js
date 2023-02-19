const express = require('express');
const router = express.Router();
const {
  getTickers,
  setTicker,
  updateTickers,
  deleteTicker,
} = require('../controllers/tickerController');

const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getTickers).post(protect, setTicker);
router.route('/:id').delete(protect, deleteTicker).put(protect, updateTickers);

module.exports = router;
