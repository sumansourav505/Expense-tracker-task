const express = require('express');
const userController = require('../controllers/user');

const router = express.Router();

// Routes for user operations
router.post('/signup', userController.signup);
router.post('/login', userController.login);

module.exports = router;
