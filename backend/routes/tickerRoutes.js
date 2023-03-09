const express = require('express');
const router = express.Router();
const { getTickerInfo, addTicker } = require('../controllers/tickerController');

const { protect } = require('../middleware/authMiddleware');

router.get('/:symbol', getTickerInfo);
router.post('/', protect, addTicker);

module.exports = router;
