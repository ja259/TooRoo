import { check, validationResult } from 'express-validator';

// General validation middleware to handle validation result
export const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

// Validation rules for registering a user
export const validateRegister = [
    check('username').notEmpty().withMessage('Username is required'),
    check('email').isEmail().withMessage('Valid email is required'),
    check('phone').isMobilePhone().withMessage('Valid phone number is required'),
    check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    check('securityQuestions').isArray({ min: 3 }).withMessage('At least 3 security questions are required'),
    check('securityQuestions.*').notEmpty().withMessage('Security question cannot be empty'),
    validate
];

// Validation rules for logging in a user
export const validateLogin = [
    check('emailOrPhone').notEmpty().withMessage('Email or phone is required'),
    check('password').notEmpty().withMessage('Password is required'),
    validate
];

// Validation rules for forgot password
export const validateForgotPassword = [
    check('email').isEmail().withMessage('Valid email is required'),
    check('securityAnswers').isArray({ min: 3 }).withMessage('At least 3 security answers are required'),
    check('securityAnswers.*').notEmpty().withMessage('Security answer cannot be empty'),
    validate
];

// Validation rules for resetting password
export const validateResetPassword = [
    check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    check('securityAnswers').isArray({ min: 3 }).withMessage('At least 3 security answers are required'),
    check('securityAnswers.*').notEmpty().withMessage('Security answer cannot be empty'),
    validate
];
