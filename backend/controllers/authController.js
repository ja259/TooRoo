import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import User from '../models/User.js';
import emailService from '../utils/emailService.js';
import smsService from '../utils/smsService.js'; // Importing the SMS service
import config from '../config/config.js';

// Helper function to generate JWT
const generateToken = (userId) => {
    return jwt.sign({ userId }, config.jwtSecret, { expiresIn: '1h' });
};

// Registration Controller
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
        const newUser = new User({ 
            username, 
            email, 
            phone, 
            password: hashedPassword, 
            securityQuestions,
            bio: '', 
            avatar: '', 
            following: [], 
            followers: [], 
            posts: [],
            newUser: true // Mark user as new
        });
        await newUser.save();

        const token = generateToken(newUser._id);
        res.status(201).json({ 
            success: true, 
            message: 'User registered successfully', 
            token, 
            user: {
                _id: newUser._id,
                username: newUser.username,
                email: newUser.email,
                phone: newUser.phone,
                bio: newUser.bio,
                avatar: newUser.avatar,
                following: newUser.following,
                followers: newUser.followers,
                posts: newUser.posts,
                createdAt: newUser.createdAt,
                updatedAt: newUser.updatedAt,
                newUser: newUser.newUser
            } 
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
    }
};

// Login Controller with 2FA
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

        // Generate a 6-digit 2FA code
        const twoFactorCode = Math.floor(100000 + Math.random() * 900000).toString();

        // Store the 2FA code and expiration time in the user's document
        user.twoFactorCode = crypto.createHash('sha256').update(twoFactorCode).digest('hex');
        user.twoFactorExpires = Date.now() + 5 * 60 * 1000; // Code valid for 5 minutes
        await user.save();

        // Send 2FA code based on user preference
        const message = `Your TooRoo 2FA code is: ${twoFactorCode}`;
        if (user.preferred2FAMethod === 'email' || user.preferred2FAMethod === 'both') {
            await emailService.sendEmail(user.email, 'Your 2FA Code', message);
        }
        if (user.preferred2FAMethod === 'sms' || user.preferred2FAMethod === 'both') {
            await smsService(user.phone, message);
        }

        res.status(200).json({ 
            success: true, 
            message: '2FA code sent to your preferred method', 
            twoFactorRequired: true, 
            userId: user._id 
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
    }
};

// 2FA Verification Controller
export const verifyTwoFactorAuth = async (req, res) => {
    try {
        const { userId, twoFactorCode } = req.body;

        if (!userId || !twoFactorCode) {
            return res.status(400).json({ success: false, message: 'User ID and 2FA code are required' });
        }

        const user = await User.findById(userId);

        if (!user || !user.twoFactorCode) {
            return res.status(400).json({ success: false, message: 'Invalid or expired 2FA code' });
        }

        // Check if the code has expired
        if (Date.now() > user.twoFactorExpires) {
            return res.status(400).json({ success: false, message: '2FA code has expired' });
        }

        // Verify the 2FA code
        const hashedCode = crypto.createHash('sha256').update(twoFactorCode.trim()).digest('hex');
        if (hashedCode !== user.twoFactorCode) {
            return res.status(400).json({ success: false, message: 'Invalid 2FA code' });
        }

        // Clear 2FA code from the user's document after successful verification
        user.twoFactorCode = undefined;
        user.twoFactorExpires = undefined;
        const isNewUser = user.newUser; // Determine if the user is new
        user.newUser = false; // Mark user as no longer new after verification
        await user.save();

        // Generate JWT token
        const token = generateToken(user._id);
        res.status(200).json({
            success: true,
            message: '2FA verified successfully',
            token,
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                phone: user.phone,
                bio: user.bio,
                avatar: user.avatar,
                following: user.following,
                followers: user.followers,
                posts: user.posts,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
                newUser: isNewUser // Return whether the user is new
            }
        });
    } catch (error) {
        console.error('2FA verification error:', error);
        res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
    }
};

// Forgot Password Controller
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

// Reset Password Controller
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

        // Validate security answers
        for (let i = 0; i < securityAnswers.length; i++) {
            if (user.securityQuestions[i].answer !== securityAnswers[i]) {
                return res.status(400).json({ success: false, message: 'Invalid security answer' });
            }
        }

        // Hash and set the new password
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
