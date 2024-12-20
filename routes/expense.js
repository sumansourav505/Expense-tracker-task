const express = require('express');
const expenseController = require('../controllers/expense');
const userauthentication = require('../middleware/auth');

const router = express.Router();

// Routes for expense operations
router.get('/user/:userId', userauthentication.authenticate, expenseController.getExpensesByUser);
router.post('/', userauthentication.authenticate, expenseController.addExpense);
router.delete('/:id', userauthentication.authenticate, expenseController.deleteExpense);

module.exports = router;
