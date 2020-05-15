const express = require('express');
const protectedRoute = require('../middleware/protected-route');
const { body } = require('express-validator');

const adminController = require('../controllers/admin');

const router = express.Router();
router.get('/products', adminController.getProducts);

router.get('/add-product', protectedRoute, adminController.getAddProduct);
router.post(
  '/add-product',
  [
    body('title').trim().isString().isLength({ min: 3 }),
    body('price').isFloat(),
    body('description').trim().isLength({ min: 5, max: 400 }),
  ],
  protectedRoute,
  adminController.postAddProduct
);

router.get(
  '/edit-product/:productId',
  protectedRoute,
  adminController.getEditProduct
);
router.post(
  '/edit-product',
  [
    body('title').trim().isString().isLength({ min: 3 }),
    body('price').isFloat(),
    body('description').trim().isLength({ min: 5, max: 400 }),
  ],
  protectedRoute,
  adminController.postEditProduct
);

router.delete(
  '/product/:productId',
  protectedRoute,
  adminController.deleteProduct
);

module.exports = router;
