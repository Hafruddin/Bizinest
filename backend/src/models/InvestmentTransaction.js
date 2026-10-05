const mongoose = require('mongoose');

const investmentTransactionSchema = new mongoose.Schema({
  businessId: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fundId: { type: mongoose.Schema.Types.ObjectId, ref: 'MutualFund', required: true },
  fundName: { type: String, required: true },
  type: { type: String, enum: ['SIP', 'LUMP_SUM', 'REDEEM'], required: true },
  amount: { type: Number, required: true },
  nav: { type: Number, required: true },
  units: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  status: { type: String, enum: ['Completed', 'Pending', 'Failed'], default: 'Completed' }
}, { timestamps: true });

module.exports = mongoose.model('InvestmentTransaction', investmentTransactionSchema);
