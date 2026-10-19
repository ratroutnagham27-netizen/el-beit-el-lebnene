const express = require('express');
const router = express.Router();
const { requireAdmin } = require('../middleware/auth');
const ProductController = require('../Controllers/ProductController');

// Create
router.post('/products', requireAdmin, ProductController.addProduct);

// Read
router.get('/products', ProductController.getProducts);

// Update
router.put('/products/:id', requireAdmin, ProductController.updateProduct);

// Delete
router.delete('/products/:id', requireAdmin, ProductController.deleteProduct);

module.exports = router;
