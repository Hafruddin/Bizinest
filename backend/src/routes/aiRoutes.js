const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middlewares/auth');
const {
  getChats,
  getChatById,
  converseOrchestrator,
  converseOrchestratorStream,
  deleteChat,
  clearChats
} = require('../controllers/aiController');

// All routes require Clerk authentication
router.use(requireAuth);

router.get('/chats', getChats);
router.get('/chats/:id', getChatById);
router.post('/chat', converseOrchestrator);
router.post('/chat/stream', converseOrchestratorStream);
router.delete('/chats/:id', deleteChat);
router.delete('/chats', clearChats);

module.exports = router;
