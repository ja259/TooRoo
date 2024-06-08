const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to validate user tokens and set user context
exports.authenticate = async (req, res, next) => {
    if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No token provided, authorization denied' });
    }

    const token = req.headers.authorization.split(' ')[1]; // Get the token from the header

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token
        const user = await User.findById(decoded.userId).select('-password'); // Find user and exclude password

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        req.user = user; // Set the user in the request object
        next();
    } catch (error) {
        console.error('Authentication error:', error);
        res.status(401).json({ message: 'Token is not valid' });
    }
};
