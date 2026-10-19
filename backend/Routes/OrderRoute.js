const express = require('express');
const router = express.Router();
const { requireAdmin } = require('../middleware/auth');
const OrderController = require('../Controllers/OrderController');

// Create
router.post('/orders', OrderController.addOrder);

// Read
router.get('/orders', requireAdmin, OrderController.getOrders);

// Details
router.get('/orders/:id/details', requireAdmin, OrderController.getOrderDetails);

// Update
router.put('/orders/:id', requireAdmin, OrderController.updateOrder);

// Delete
router.delete('/orders/:id', requireAdmin, OrderController.deleteOrder);

module.exports = router;
