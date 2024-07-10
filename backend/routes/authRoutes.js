import express from 'express';
import { register, login, forgotPassword, resetPassword } from '../controllers/authController.js';
import { body } from 'express-validator';
import { validate } from '../middlewares/validate.js';

const router = express.Router();

router.post('/register', [
    body('username').notEmpty().withMessage('Username is required'),
    body('email').isEmail().withMessage('Invalid email'),
    body('phone').notEmpty().withMessage('Phone is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('securityQuestions').isArray({ min: 3 }).withMessage('Security questions must be provided')
], validate, register);

router.post('/login', [
    body('emailOrPhone').notEmpty().withMessage('Email or phone is required'),
    body('password').notEmpty().withMessage('Password is required')
], validate, login);

router.post('/forgot-password', [
    body('email').isEmail().withMessage('Invalid email')
], validate, forgotPassword);

router.put('/reset-password/:token', [
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('securityAnswers').isArray({ min: 3 }).withMessage('Security answers must be provided')
], validate, resetPassword);

export default router;
