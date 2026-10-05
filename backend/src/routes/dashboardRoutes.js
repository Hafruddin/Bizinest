const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middlewares/auth');
const { getStats, getCharts } = require('../controllers/dashboardController');

// All routes require Clerk authentication
router.use(requireAuth);

router.get('/stats', getStats);
router.get('/charts', getCharts);

module.exports = router;
