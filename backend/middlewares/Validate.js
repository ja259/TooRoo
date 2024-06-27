const { body, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const extractedErrors = errors.array().map(err => ({
            field: err.param,
            message: err.msg
        }));
        return res.status(400).json({
            success: false,
            errors: extractedErrors
        });
    }
    next();
};

const validateRegister = [
    body('username')
        .trim()
        .notEmpty()
        .withMessage('Username is required')
        .isLength({ min: 3 })
        .withMessage('Username must be at least 3 characters long'),
    body('email')
        .isEmail()
        .withMessage('Provide a valid email')
        .normalizeEmail(),
    body('phone')
        .trim()
        .notEmpty()
        .withMessage('Phone number is required')
        .isLength({ min: 10, max: 15 })
        .withMessage('Provide a valid phone number'),
    body('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long'),
    body('securityQuestions')
        .isArray({ min: 3 })
        .withMessage('Provide at least 3 security questions and answers'),
    handleValidationErrors
];

const validateLogin = [
    body('emailOrPhone')
        .notEmpty()
        .withMessage('Email or Phone is required'),
    body('password')
        .notEmpty()
        .withMessage('Password is required'),
    handleValidationErrors
];

const validateResetPassword = [
    body('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long'),
    body('securityAnswers')
        .isArray({ min: 3 })
        .withMessage('Provide at least 3 security answers'),
    handleValidationErrors
];

const validateForgotPassword = [
    body('email')
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Provide a valid email')
        .normalizeEmail(),
    handleValidationErrors
];

module.exports = {
    validateRegister,
    validateLogin,
    validateResetPassword,
    validateForgotPassword
};
