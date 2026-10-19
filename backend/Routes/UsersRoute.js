const express = require('express');
const router = express.Router();
const { requireAdmin } = require('../middleware/auth');
const UsersController = require('../Controllers/UsersController');

// Create
router.post('/users', UsersController.addUser);

// Read
router.get('/users', requireAdmin, UsersController.getUsers);

// Update
router.put('/users/:id', requireAdmin, UsersController.updateUser);

// Delete
router.delete('/users/:id', requireAdmin, UsersController.deleteUser);

module.exports = router;
