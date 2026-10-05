const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middlewares/auth');
const {
  getInvoices,
  getInvoiceById,
  createInvoice,
  downloadPDF,
  updateStatus
} = require('../controllers/invoiceController');

// All routes require Clerk authentication
router.use(requireAuth);

router.get('/', getInvoices);
router.post('/', createInvoice);
router.get('/:id', getInvoiceById);
router.get('/:id/pdf', downloadPDF);
router.put('/:id/status', updateStatus);

module.exports = router;
