const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middlewares/auth');
const { getSchemes, matchSchemes } = require('../controllers/schemeController');

// All routes require Clerk authentication
router.use(requireAuth);

router.get('/', getSchemes);
router.post('/match', matchSchemes);

module.exports = router;
