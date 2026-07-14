const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Verify custom JWT issued by our backend
const authMiddleware = async (req, res, next) => {
  console.log('Auth middleware invoked'); // Log when the middleware is called
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    
    // Find the user in MongoDB
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'User not found.' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error.message);
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
};

module.exports = authMiddleware;
