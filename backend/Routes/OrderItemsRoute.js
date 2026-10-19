const express = require('express');
const router = express.Router();
const { requireAdmin } = require('../middleware/auth');
const OrderItemsController = require('../Controllers/OrderItemsController');

// Create
router.post('/order-items', OrderItemsController.addOrderItem);

// Read
router.get('/order-items', requireAdmin, OrderItemsController.getOrderItems);

// Update
router.put('/order-items/:id', requireAdmin, OrderItemsController.updateOrderItem);

// Delete
router.delete('/order-items/:id', requireAdmin, OrderItemsController.deleteOrderItem);

module.exports = router;
