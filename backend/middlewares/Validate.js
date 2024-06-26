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
    body('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long')
        .matches(/[a-z]/, 'i')
        .withMessage('Password must contain at least one letter')
        .matches(/[0-9]/)
        .withMessage('Password must contain at least one number'),
    body('fullName')
        .notEmpty()
        .withMessage('Full name is required'),
    body('birthdate')
        .isISO8601()
        .withMessage('Provide a valid birthdate'),
    body('gender')
        .notEmpty()
        .withMessage('Gender is required'),
    body('phone')
        .isMobilePhone()
        .withMessage('Provide a valid phone number'),
    body('securityQuestion1')
        .notEmpty()
        .withMessage('Security question 1 is required'),
    body('securityAnswer1')
        .notEmpty()
        .withMessage('Security answer 1 is required'),
    body('securityQuestion2')
        .notEmpty()
        .withMessage('Security question 2 is required'),
    body('securityAnswer2')
        .notEmpty()
        .withMessage('Security answer 2 is required'),
    body('securityQuestion3')
        .notEmpty()
        .withMessage('Security question 3 is required'),
    body('securityAnswer3')
        .notEmpty()
        .withMessage('Security answer 3 is required'),
    handleValidationErrors
];

const validateLogin = [
    body('emailOrPhone')
        .notEmpty()
        .withMessage('Email or phone is required')
        .custom(value => {
            if (!/^\S+@\S+\.\S+$/.test(value) && !/^\d{10}$/.test(value)) {
                throw new Error('Provide a valid email or phone number');
            }
            return true;
        }),
    body('password')
        .notEmpty()
        .withMessage('Password is required'),
    handleValidationErrors
];

const validateResetPassword = [
    body('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long')
        .matches(/[a-z]/, 'i')
        .withMessage('Password must contain at least one letter')
        .matches(/[0-9]/)
        .withMessage('Password must contain at least one number'),
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