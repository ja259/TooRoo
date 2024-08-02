import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import config from '../config/config.js';

export const authenticate = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, config.jwtSecret);
        req.user = decoded.userId;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};

export const protect = async (req, res, next) => {
    try {
        const user = await User.findById(req.user);

        if (!user) {
            return res.status(401).json({ message: 'Not authorized, user not found' });
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Not authorized' });
    }
};
