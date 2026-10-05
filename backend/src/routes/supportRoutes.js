const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middlewares/auth');
const { getTickets, createTicket, updateTicket } = require('../controllers/supportController');

// All routes require Clerk authentication
router.use(requireAuth);

router.get('/', getTickets);
router.post('/', createTicket);
router.get('/tickets', getTickets);
router.post('/tickets', createTicket);
router.put('/tickets/:id', updateTicket);

module.exports = router;
