import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import User from '../models/User.js';
import emailService from '../utils/emailService.js';

export const register = async (req, res) => {
    try {
        const { username, email, phone, password, securityQuestions } = req.body;

        if (!username || !email || !phone || !password || !securityQuestions || securityQuestions.length < 3) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
        if (existingUser) {
            return res.status(409).json({ message: 'Email or phone already registered' });
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const newUser = new User({ username, email, phone, password: hashedPassword, securityQuestions });
        await newUser.save();

        const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(201).json({ message: 'User registered successfully', token, userId: newUser._id });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
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
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ message: 'Logged in successfully', token, userId: user._id });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const resetToken = crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        user.resetPasswordExpires = Date.now() + 3600000;

        await user.save();

        const resetUrl = `http://localhost:8080/reset-password/${resetToken}`;
        const message = `You have requested a password reset. Please make a PUT request to: \n\n ${resetUrl}`;
        await emailService.sendEmail(user.email, 'Password Reset Request', message);

        res.status(200).json({ message: 'Password reset token sent', token: resetToken });
    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

export const resetPassword = async (req, res) => {
    try {
        const { token, password, securityAnswers } = req.body;
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: 'Token is invalid or has expired' });
        }

        // Verify security answers
        for (let i = 0; i < securityAnswers.length; i++) {
            if (user.securityQuestions[i].answer !== securityAnswers[i]) {
                return res.status(400).json({ message: 'Invalid security answer' });
            }
        }

        user.password = await bcrypt.hash(password, 12);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.status(200).json({ message: 'Password has been reset successfully' });
    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};
