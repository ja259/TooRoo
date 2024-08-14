import express from 'express';
import { register, login, forgotPassword, resetPassword } from '../controllers/authController.js';
import { validateRegister, validateLogin, validateForgotPassword, validateResetPassword } from '../middlewares/Validate.js';

const router = express.Router();

router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);
router.post('/forgot-password', validateForgotPassword, forgotPassword);
router.put('/reset-password/:token', validateResetPassword, resetPassword);

export default router;
