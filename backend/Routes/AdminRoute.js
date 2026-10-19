const express = require('express');
const router = express.Router();
const { requireAdmin } = require('../middleware/auth');
const AdminController = require('../Controllers/AdminController');

// Create
router.post('/categories', requireAdmin, AdminController.addCategory);

// Read
router.get('/categories', AdminController.getCategories);

// Update
router.put('/categories/:id', requireAdmin, AdminController.updateCategory);

// Delete
router.delete('/categories/:id', requireAdmin, AdminController.deleteCategory);

module.exports = router;
