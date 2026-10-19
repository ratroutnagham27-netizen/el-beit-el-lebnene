const express = require('express');
const router = express.Router();
const { requireAdmin } = require('../middleware/auth');
const ContactController = require('../Controllers/ContactController');

router.post('/contact-messages', ContactController.addContactMessage);
router.get('/contact-messages', requireAdmin, ContactController.getContactMessages);
router.delete('/contact-messages/:id', requireAdmin, ContactController.deleteContactMessage);

module.exports = router;
