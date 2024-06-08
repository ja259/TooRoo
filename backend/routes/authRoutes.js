const express = require('express');
const { register, login, forgotPassword, resetPassword } = require('../controllers/authController');
const { validateRegister, validateLogin, validateResetPassword } = require('../middlewares/Validate');
const rateLimit = require('express-rate-limit');

const router = express.Router();

// Setup rate limit for auth routes to prevent brute force attacks
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Apply rate limiter to all authentication routes
router.use(authLimiter);

// Register new user with validation middleware
router.post('/register', validateRegister, register);

// Login user with validation middleware
router.post('/login', validateLogin, login);

// Forgot password route
router.post('/forgot-password', forgotPassword);

// Reset password with validation middleware
router.post('/reset-password/:token', validateResetPassword, resetPassword);

module.exports = router;

