const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middlewares/auth');
const { syncUser, getProfile, updateProfile } = require('../controllers/authController');

// Synchronize Clerk profile with MongoDB
router.post('/sync', requireAuth, syncUser);

// Fetch current user and business details
router.get('/profile', requireAuth, getProfile);

// Update profile details
router.put('/profile', requireAuth, updateProfile);

module.exports = router;
