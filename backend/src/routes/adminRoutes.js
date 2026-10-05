const express = require('express');
const router = express.Router();
const { requireAuth, requireRole } = require('../middlewares/auth');
const { getHealth } = require('../controllers/adminController');

// All routes require Clerk authentication AND Admin Role
router.use(requireAuth);
router.use(requireRole(['Admin']));

router.get('/health', getHealth);

module.exports = router;
