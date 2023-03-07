const express = require('express');
const router = express.Router();
const { getTickerInfo } = require('../controllers/tickerController');

router.get('/:symbol', getTickerInfo);

module.exports = router;
