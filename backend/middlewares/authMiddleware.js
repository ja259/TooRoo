const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to validate user tokens and set user context
exports.authenticate = async (req, res, next) => {
    try {
        // Get token from the header
        const token = req.headers.authorization.split(" ")[1]; // Assumes Bearer token
        if (!token) {
            return res.status(401).json({ message: 'No token, authorization denied' });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return res.status(401).json({ message: 'Token is not valid' });
        }

        // Check for user
        const user = await User.findById(decoded.userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Set user to request object
        req.user = user;
        next();
    } catch (error) {
        console.error('Something wrong with auth middleware:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};
