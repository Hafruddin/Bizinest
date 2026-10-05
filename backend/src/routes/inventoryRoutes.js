const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middlewares/auth');
const {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getLowStock,
  getInventoryInsights
} = require('../controllers/inventoryController');

// All routes require Clerk authentication
router.use(requireAuth);

router.get('/', getProducts);
router.post('/', createProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);
router.get('/low-stock', getLowStock);
router.get('/insights', getInventoryInsights);

module.exports = router;
