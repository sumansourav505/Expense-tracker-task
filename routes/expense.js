const express = require('express');
const expenseController = require('../controllers/expense');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Routes for expense operations
router.get('/user/', authenticate, expenseController.getExpensesByUser);
router.post('/', authenticate, expenseController.addExpense);
router.delete('/:id', authenticate, expenseController.deleteExpense);

module.exports = router;
