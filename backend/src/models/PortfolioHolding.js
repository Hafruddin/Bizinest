const mongoose = require('mongoose');

const portfolioHoldingSchema = new mongoose.Schema({
  businessId: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fundId: { type: mongoose.Schema.Types.ObjectId, ref: 'MutualFund', required: true },
  fundName: { type: String, required: true },
  category: { type: String, required: true },
  units: { type: Number, required: true },
  avgNav: { type: Number, required: true },
  investedAmount: { type: Number, required: true },
  currentNav: { type: Number, required: true },
  currentValue: { type: Number, required: true },
  gainLoss: { type: Number, required: true, default: 0 },
  gainPercentage: { type: Number, required: true, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('PortfolioHolding', portfolioHoldingSchema);
