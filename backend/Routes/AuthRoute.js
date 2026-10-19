const express = require('express');
const router = express.Router();
const AuthController = require('../Controllers/AuthController');

router.post('/auth/login', AuthController.login);

module.exports = router;
