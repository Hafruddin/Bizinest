const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middlewares/auth');
const {
  getTransactions,
  createExpense,
  getExpenses,
  getFinancialInsights
} = require('../controllers/financeController');

// All routes require Clerk authentication
router.use(requireAuth);

router.get('/', getTransactions);
router.get('/overview', getTransactions);
router.get('/transactions', getTransactions);
router.post('/expenses', createExpense);
router.get('/expenses', getExpenses);
router.get('/insights', getFinancialInsights);

module.exports = router;
