const express = require('express');
const { register, login, forgotPassword, resetPassword } = require('../controllers/authController');
const { validateRegister, validateLogin, validateResetPassword } = require('../middlewares/validate');
const rateLimit = require('express-rate-limit');

const router = express.Router();

// Rate limiting settings to prevent brute force attacks
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
});

// Apply the rate limiter to all auth routes
router.use(authLimiter);

// Route definitions
// Registration route
router.post('/register', validateRegister, register);

// Login route
router.post('/login', validateLogin, login);

// Forgot password route
router.post('/forgot-password', forgotPassword);

// Reset password route
router.post('/reset-password', validateResetPassword, resetPassword);

module.exports = router;


