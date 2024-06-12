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

router.use(authLimiter);

// Route definitions
router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', validateResetPassword, resetPassword);

module.exports = router;


