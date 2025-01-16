const Expense = require('../models/expense');
const User = require('../models/user');

// Get all expenses for a user
exports.getExpensesByUser = async (req, res) => {
    try {
        const expenses = await Expense.findAll({ where: { userId: req.user.id } });
        res.status(200).json(expenses);
    } catch (error) {
        console.error('Error fetching expenses:', error);
        res.status(500).json({ message: 'Failed to fetch expenses.' });
    }
};

// Add a new expense
exports.addExpense = async (req, res) => {
    const { description, amount, category } = req.body;

    if (!description || !amount || !category) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    try {
        const newExpense = await Expense.create({
            description,
            amount,
            category,
            userId: req.user.id,
        });
        //update total expense for user
        const updatedTotal = Number(req.user.totalExpenses || 0) + Number(amount);
        req.user.totalExpenses=updatedTotal;
        await User.update(
            { totalExpenses: updatedTotal },
            { where: { id: req.user.id } }
        );
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
        const expense = await Expense.findOne({ where: { id, userId: req.user.id } });

        if (!expense) {
            return res.status(404).json({ message: 'Expense not found or not authorized.' });
        }
        //deduct expense amount from total expense
        const updatedTotal = Number(req.user.totalExpenses || 0) - Number(expense.amount);
        req.user.totalExpenses=updatedTotal;
        await User.update(
            { totalExpenses: updatedTotal },
            { where: { id: req.user.id } }
        );
        await expense.destroy();
        res.status(200).json({ message: 'Expense deleted successfully.' });
    } catch (error) {
        console.error('Error deleting expense:', error);
        res.status(500).json({ message: 'Failed to delete expense.' });
    }
};
