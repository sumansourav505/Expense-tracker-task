const Expense = require('../models/expense');

// Get all expenses for a user
exports.getExpensesByUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const expenses = await Expense.findAll({ where: { userId } });
        res.status(200).json(expenses);
    } catch (error) {
        console.error('Error fetching expenses:', error);
        res.status(500).json({ message: 'Failed to fetch expenses.' });
    }
};

// Add a new expense
exports.addExpense = async (req, res) => {
    const { description, amount, category, userId } = req.body;

    if (!description || !amount || !category || !userId) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    try {
        const newExpense = await Expense.create({ description, amount, category, userId });
        res.status(201).json(newExpense);
    } catch (error) {
        console.error('Error adding expense:', error);
        res.status(500).json({ message: 'Failed to add expense.' });
    }
};

// Delete an expense
exports.deleteExpense = async (req, res) => {
    const { id } = req.params;

    try {
        const rowsDeleted = await Expense.destroy({ where: { id } });

        if (rowsDeleted === 0) {
            return res.status(404).json({ message: 'Expense not found.' });
        }

        res.status(200).json({ message: 'Expense deleted successfully.' });
    } catch (error) {
        console.error('Error deleting expense:', error);
        res.status(500).json({ message: 'Failed to delete expense.' });
    }
};
