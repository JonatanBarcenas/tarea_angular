const mongoose = require('mongoose');

const ResponseSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true
  },
  answer: {
    type: String,
    required: true
  }
});

const SurveyResponseSchema = new mongoose.Schema({
  responses: [ResponseSchema],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('SurveyResponse', SurveyResponseSchema); 