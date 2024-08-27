import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import User from '../models/User.js';
import emailService from '../utils/emailService.js';
import config from '../config/config.js';

// Helper function to generate JWT
const generateToken = (userId) => {
    return jwt.sign({ userId }, config.jwtSecret, { expiresIn: '1h' });
};

export const register = async (req, res) => {
    try {
        const { username, email, phone, password, securityQuestions } = req.body;

        if (!username || !email || !phone || !password || !securityQuestions || securityQuestions.length < 3) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }

        const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
        if (existingUser) {
            return res.status(409).json({ success: false, message: 'Email or phone already registered' });
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const newUser = new User({ username, email, phone, password: hashedPassword, securityQuestions });
        await newUser.save();

        const token = generateToken(newUser._id);
        res.status(201).json({ success: true, message: 'User registered successfully', token, user: newUser });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
    }
};

export const login = async (req, res) => {
    try {
        const { emailOrPhone, password } = req.body;
        let user;

        if (emailOrPhone.includes('@')) {
            user = await User.findOne({ email: emailOrPhone }).select('+password');
        } else {
            user = await User.findOne({ phone: emailOrPhone }).select('+password');
        }

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const token = generateToken(user._id);
        res.status(200).json({ success: true, message: 'Logged in successfully', token, user });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
    }
};

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const resetToken = crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

        await user.save();

        const resetUrl = `http://localhost:8080/reset-password/${resetToken}`;
        const message = `You have requested a password reset. Please make a PUT request to: \n\n ${resetUrl}`;
        await emailService.sendEmail(user.email, 'Password Reset Request', message);

        res.status(200).json({ success: true, message: 'Password reset token sent', token: resetToken });
    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
    }
};

export const resetPassword = async (req, res) => {
    try {
        const { token, password, securityAnswers } = req.body;

        if (!token || !password || !securityAnswers || securityAnswers.length < 3) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }

        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ success: false, message: 'Token is invalid or has expired' });
        }

        for (let i = 0; i < securityAnswers.length; i++) {
            if (user.securityQuestions[i].answer !== securityAnswers[i]) {
                return res.status(400).json({ success: false, message: 'Invalid security answer' });
            }
        }

        user.password = await bcrypt.hash(password, 12);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.status(200).json({ success: true, message: 'Password has been reset successfully' });
    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
    }
};
