const Expense = require('../models/expense');
const User = require('../models/user');
const sequelize = require('../config/database');

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
    const t = await sequelize.transaction();
    const { description, amount, category } = req.body;

    if (!description || !amount || !category) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    try {
        // Add the expense within the transaction
        const newExpense = await Expense.create(
            {
                description,
                amount,
                category,
                userId: req.user.id,
            },
            { transaction: t }
        );

        // Update the user's total expenses
        const updatedTotal = Number(req.user.totalExpenses || 0) + Number(amount);
        await User.update(
            { totalExpenses: updatedTotal },
            { where: { id: req.user.id } },
            { transaction: t }
        );

        await t.commit();
        res.status(201).json(newExpense);
    } catch (error) {
        await t.rollback();
        console.error('Error adding expense:', error);
        res.status(500).json({ message: 'Failed to add expense.' });
    } finally {
        if (t.finished !== 'commit') await t.rollback();
    }
};

// Delete an expense
exports.deleteExpense = async (req, res) => {
    const { id } = req.params;
    const t = await sequelize.transaction();

    try {
        // Find the expense within the transaction
        const expense = await Expense.findOne(
            { where: { id, userId: req.user.id } },
            { transaction: t }
        );

        if (!expense) {
            return res.status(404).json({ message: 'Expense not found or not authorized.' });
        }

        // Deduct the expense amount from the user's total expenses
        const updatedTotal = Number(req.user.totalExpenses || 0) - Number(expense.amount);
        await User.update(
            { totalExpenses: updatedTotal },
            { where: { id: req.user.id } },
            { transaction: t }
        );

        // Delete the expense within the transaction
        await expense.destroy({ transaction: t });

        await t.commit();
        res.status(200).json({ message: 'Expense deleted successfully.' });
    } catch (error) {
        await t.rollback();
        console.error('Error deleting expense:', error);
        res.status(500).json({ message: 'Failed to delete expense.' });
    } finally {
        if (t.finished !== 'commit') await t.rollback();
    }
};
