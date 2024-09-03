import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import config from '../config/config.js';

export const authenticate = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ success: false, message: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, config.jwtSecret);
        req.user = decoded.userId; // Store userId in req.user
        next();
    } catch (err) {
        res.status(401).json({ success: false, message: 'Token is not valid' });
    }
};

export const protect = async (req, res, next) => {
    try {
        const user = await User.findById(req.user); // Retrieve full user object

        if (!user) {
            return res.status(401).json({ success: false, message: 'Not authorized, user not found' });
        }

        req.user = user; // Replace userId with full user object
        next();
    } catch (error) {
        res.status(401).json({ success: false, message: 'Not authorized' });
    }
};
