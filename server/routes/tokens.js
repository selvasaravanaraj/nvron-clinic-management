const express = require('express');
const router = express.Router();
const Token = require('../models/Token');

// Get all tokens
router.get('/', async (req, res) => {
  try {
    const tokens = await Token.find().sort({ tokenNumber: 1 });
    console.log(tokens);
    res.json(tokens);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tokens', error: error.message });
  }
});

// Create new token
router.post('/', async (req, res) => {
  try {
    const { patientName, phoneNumber, isVIP } = req.body;

    // Get the last token number
    const lastToken = await Token.findOne().sort({ tokenNumber: -1 });
    const tokenNumber = lastToken ? lastToken.tokenNumber + 1 : 1;

    const token = new Token({
      tokenNumber,
      patientName,
      phoneNumber,
      isVIP: isVIP || false
    });

    await token.save();

    // Emit socket event for new token
    req.app.get('io').emit('newToken', token);

    res.status(201).json(token);
  } catch (error) {
    res.status(500).json({ message: 'Error creating token', error: error.message });
  }
});

// Update token status
router.put('/:id', async (req, res) => {
  try {
    const { status, isVIP, notes } = req.body;
    const token = await Token.findByIdAndUpdate(
      req.params.id,
      { status, isVIP, notes },
      { new: true }
    );

    if (!token) {
      return res.status(404).json({ message: 'Token not found' });
    }

    // Emit socket event for token update
    req.app.get('io').emit('tokenUpdate', token);

    res.json(token);
  } catch (error) {
    res.status(500).json({ message: 'Error updating token', error: error.message });
  }
});

// Delete token
router.delete('/:id', async (req, res) => {
  try {
    const token = await Token.findByIdAndDelete(req.params.id);
    
    if (!token) {
      return res.status(404).json({ message: 'Token not found' });
    }

    // Emit socket event for token deletion
    req.app.get('io').emit('tokenDelete', token._id);

    res.json({ message: 'Token deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting token', error: error.message });
  }
});

// Get current token
router.get('/current', async (req, res) => {
  try {
    const currentToken = await Token.findOne({ status: 'in-progress' });
    res.json(currentToken);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching current token', error: error.message });
  }
});

module.exports = router; 