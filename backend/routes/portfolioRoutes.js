const express = require('express');
const router = express.Router();
const Position = require('../models/position');

// GET all positions
router.get('/', async (req, res) => {
  try {
    const positions = await Position.find();
    res.json(positions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET a single position by id
router.get('/:id', getPosition, (req, res) => {
  res.json(res.position);
});

// CREATE a new position
router.post('/', async (req, res) => {
  const position = new Position({
    ticker: req.body.ticker,
    quantity: req.body.quantity,
    costBasis: req.body.costBasis,
  });
  try {
    const newPosition = await position.save();
    res.status(201).json(newPosition);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// UPDATE a position
router.patch('/:id', getPosition, async (req, res) => {
  if (req.body.ticker != null) {
    res.position.ticker = req.body.ticker;
  }
  if (req.body.quantity != null) {
    res.position.quantity = req.body.quantity;
  }
  if (req.body.costBasis != null) {
    res.position.costBasis = req.body.costBasis;
  }
  try {
    const updatedPosition = await res.position.save();
    res.json(updatedPosition);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE a position
router.delete('/:id', getPosition, async (req, res) => {
  try {
    await res.position.remove();
    res.json({ message: 'Position deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// middleware function to get a single position by id
async function getPosition(req, res, next) {
  let position;
  try {
    position = await Position.findById(req.params.id);
    if (position == null) {
      return res.status(404).json({ message: 'Position not found' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.position = position;
  next();
}

module.exports = router;
