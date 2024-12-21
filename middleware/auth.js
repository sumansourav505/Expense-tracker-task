const jwt = require('jsonwebtoken');
const User = require('../models/user');

const authenticate = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Access denied. No token provided.' });
        }

        const decoded = jwt.verify(token, 'secretkey');
        const user = await User.findByPk(decoded.userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        req.user = user; // Attach authenticated user to the request
        next();
    } catch (error) {
        console.error('Authentication error:', error.message);
        res.status(401).json({ message: 'Invalid or expired token.' });
    }
};

module.exports = { authenticate };
