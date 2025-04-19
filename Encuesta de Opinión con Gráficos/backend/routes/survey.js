const express = require('express');
const router = express.Router();
const SurveyResponse = require('../models/Survey');

// Submit a new survey response
router.post('/', async (req, res) => {
  try {
    const newResponse = new SurveyResponse({
      responses: req.body.responses
    });
    
    const savedResponse = await newResponse.save();
    res.status(201).json(savedResponse);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all survey responses
router.get('/', async (req, res) => {
  try {
    const responses = await SurveyResponse.find();
    res.json(responses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get aggregated results for charts
router.get('/results', async (req, res) => {
  try {
    // Get all responses
    const allResponses = await SurveyResponse.find();
    
    // Process data for chart visualization
    const results = {};
    
    allResponses.forEach(response => {
      response.responses.forEach(item => {
        if (!results[item.question]) {
          results[item.question] = {};
        }
        
        if (!results[item.question][item.answer]) {
          results[item.question][item.answer] = 1;
        } else {
          results[item.question][item.answer]++;
        }
      });
    });
    
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 