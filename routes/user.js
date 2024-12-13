const express = require('express');
const User = require('../models/user');
const router = express.Router();

// Login route
router.post('/', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(400).json({ message: 'Email ID is incorrect.' });
        }

        if (user.password !== password) {
            return res.status(400).json({ message: 'Password is incorrect.' });
        }

        res.status(200).json({ message: 'User login successful!' });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'An error occurred. Please try again.' });
    }
});

// Signup route (remains unchanged)
router.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ where: { email } });

        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const newUser = await User.create({ name, email, password });
        res.status(201).json({ message: 'User signed up successfully', user: newUser });
    } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).json({ message: 'An error occurred. Please try again.' });
    }
});

module.exports = router;
