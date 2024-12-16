const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const Expense=require('../models/expense');
const router = express.Router();

// Set salt rounds
const saltRounds = 10;

// Signup route
router.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ where: { email } });

        if (existingUser) {
            return res.status(400).json({ message: 'User already exists.' });
        }

        // Hash the password with bcrypt
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create a new user with the hashed password
        const newUser = await User.create({ name, email, password: hashedPassword });
        res.status(201).json({ message: 'User signed up successfully.', user: newUser });
    } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).json({ message: 'An error occurred. Please try again later.' });
    }
});



// Login route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if the user exists in the database
        const user = await User.findOne({ where: { email } });

        if (!user) {
            // User not found
            return res.status(404).json({ message: 'User not found.' });
        }

        // Compare the provided password with the hashed password
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (passwordMatch) {
            // Password matches
            return res.status(200).json({ message: 'User login successful!' });
        } else {
            // Password doesn't match
            return res.status(401).json({ message: 'Password is incorrect.' });
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'An error occurred. Please try again later.' });
    }
});

module.exports = router;
