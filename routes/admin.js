const express = require('express');
const protectedRoute = require('../middleware/protected-route');

const adminController = require('../controllers/admin');

const router = express.Router();
router.get('/products', adminController.getProducts);

router.get('/add-product', protectedRoute, adminController.getAddProduct);
router.post('/add-product', protectedRoute, adminController.postAddProduct);

router.get(
  '/edit-product/:productId',
  protectedRoute,
  adminController.getEditProduct
);
router.post('/edit-product', protectedRoute, adminController.postEditProduct);

router.post(
  '/delete-product',
  protectedRoute,
  adminController.postDeleteProduct
);

module.exports = router;
