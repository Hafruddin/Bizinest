const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middlewares/auth');
const {
  getProfile,
  updateProfile,
  assessRisk,
  getGoals,
  createGoal,
  getFunds,
  compareFunds,
  getRecommendations,
  calculateSip,
  calculateLumpSum,
  getPortfolio,
  getTransactions,
  investSimulate,
  redeemSimulate,
  getWatchlist,
  addToWatchlist,
  removeFromWatchlist,
  wealthChat
} = require('../controllers/wealthController');

router.use(requireAuth);

// Investor Profile & Capacity
router.get('/profile', getProfile);
router.post('/profile', updateProfile);

// Risk Assessment
router.post('/risk-assessment', assessRisk);

// Financial Goals
router.get('/goals', getGoals);
router.post('/goals', createGoal);

// Mutual Funds Catalog & Comparison
router.get('/funds', getFunds);
router.post('/funds/compare', compareFunds);

// Recommendations
router.post('/recommendations', getRecommendations);
router.get('/ai-recommendations', (req, res) => {
  res.status(200).json({
    status: 'success',
    data: [
      { id: 1, title: 'Tax Saving ELSS SIP', fund: 'Parag Parikh Flexi Cap Fund', return1Yr: '24.5%', recommendation: 'Invest ₹5,000/mo via SIP' },
      { id: 2, title: 'Emergency Liquid Buffer', fund: 'HDFC Liquid Fund', return1Yr: '7.2%', recommendation: 'Park ₹50,000 for working capital reserve' }
    ]
  });
});

// Live Market Overview
router.get('/live-market', (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      nifty50: { value: 24350.20, change: '+124.50', changePercent: '+0.51%' },
      sensex: { value: 79820.15, change: '+380.10', changePercent: '+0.48%' },
      niftyBank: { value: 51200.40, change: '-45.30', changePercent: '-0.09%' },
      topGainers: [
        { name: 'Tata Steel', price: 154.20, change: '+3.4%' },
        { name: 'JSW Steel', price: 920.50, change: '+2.8%' },
        { name: 'Hindalco', price: 685.10, change: '+2.1%' }
      ]
    }
  });
});

// Calculators
router.post('/sip-calculator', calculateSip);
router.post('/lumpsum-calculator', calculateLumpSum);

// Portfolio & Transactions
router.get('/portfolio', getPortfolio);
router.get('/transactions', getTransactions);

// Simulation Operations
router.post('/invest-simulate', investSimulate);
router.post('/redeem-simulate', redeemSimulate);

// Watchlist
router.get('/watchlist', getWatchlist);
router.post('/watchlist', addToWatchlist);
router.delete('/watchlist/:fundId', removeFromWatchlist);

// AI Wealth Chat
router.post('/chat', wealthChat);

module.exports = router;
