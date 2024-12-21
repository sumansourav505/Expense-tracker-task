const bcrypt = require('bcrypt');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

const saltRounds = 10;
const jwtSecret = 'secretkey';

// Function to generate access token
exports.generateAccessToken = (id, name) => {
    return jwt.sign(
        { userId: id, name: name }, 
        jwtSecret, 
        { expiresIn: '7d' } // Add token expiration
    );
};

// Signup user
exports.signup = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists.' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create new user
        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        res.status(201).json({ message: 'User signed up successfully.', user: newUser });
    } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).json({ message: 'An error occurred during signup.' });
    }
};

// Login user
exports.login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }

    try {
        // Find user by email
        const user = await User.findOne({ where: { email } });

        if (!user) {
            console.log('Login Attempt: User not found');
            return res.status(404).json({ message: 'User not found.' });
        }

        console.log('User Found:', { id: user.id, name: user.name }); // Improved log

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            const token = exports.generateAccessToken(user.id, user.name);

            console.log('Token Generated:', token); // Debugging log
            res.status(200).json({ 
                message: 'Login successful!', 
                token, 
                userId: user.id, 
                name: user.name 
            });
        } else {
            console.log('Login Attempt: Incorrect password');
            res.status(401).json({ message: 'Incorrect password.' });
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'An error occurred during login.' });
    }
};
