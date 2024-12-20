const jwt = require('jsonwebtoken');
const User = require('../models/user');

// Authentication Middleware
const authenticate = async (req, res, next) => {
  try {
    const token = req.header('Authorization');
    if (!token) {
      return res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secretkey');
    const user = await User.findByPk(decoded.userId);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    req.user = user; // Attach user to request object
    next();
  } catch (err) {
    console.error('Authentication error:', err.message);
    res.status(401).json({ success: false, message: 'Invalid or expired token.' });
  }
};

module.exports = authenticate;
