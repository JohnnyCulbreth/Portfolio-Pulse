const express = require('express');
const router = express.Router();
const {
  getTickers,
  setTicker,
  updateTickers,
  deleteTicker,
} = require('../controllers/tickerController');

router.route('/').get(getTickers).post(setTicker);
router.route('/:id').delete(deleteTicker).put(updateTickers);

module.exports = router;
