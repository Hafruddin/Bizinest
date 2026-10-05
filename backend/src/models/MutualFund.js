const mongoose = require('mongoose');

const mutualFundSchema = new mongoose.Schema({
  name: { type: String, required: true },
  amc: { type: String, required: true },
  category: {
    type: String,
    enum: ['Small Cap', 'Mid Cap', 'Flexi Cap', 'Large Cap', 'ELSS', 'Hybrid', 'Index', 'Liquid'],
    required: true
  },
  riskLevel: {
    type: String,
    enum: ['Low', 'Moderate', 'High', 'Very High'],
    required: true
  },
  nav: { type: Number, required: true },
  cagr3Y: { type: Number, required: true },
  expenseRatio: { type: Number, required: true },
  minSip: { type: Number, required: true, default: 500 },
  rating: { type: Number, default: 5 },
  fundSizeCr: { type: Number, default: 12500 },
  description: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('MutualFund', mutualFundSchema);
