const express = require('express');
const User = require('../models/user');
const router = express.Router();

router.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create a new user
        const newUser = await User.create({ name, email, password });
        res.status(201).json({ message: 'User signed up successfully', user: newUser });
    } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).json({ message: 'An error occurred. Please try again.' });
    }
});

module.exports = router;
