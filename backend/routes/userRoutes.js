import express from 'express';
import uploadMiddleware from '../middlewares/uploadMiddleware.js';
import {
    getUserProfile,
    updateUserProfile,
    followUser,
    unfollowUser,
    getUserAnalytics,
    getUserSettings,
    updateUserSettings,
    uploadProfilePicture
} from '../controllers/userController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Routes for User Profile
router.get('/:id', protect, getUserProfile);
router.put('/:id', protect, uploadMiddleware, updateUserProfile);

// Routes for Follow and Unfollow Users
router.post('/:id/follow', protect, followUser);
router.post('/:id/unfollow', protect, unfollowUser);

// Routes for User Analytics
router.get('/analytics', protect, getUserAnalytics);

// Routes for User Settings
router.get('/:userId/settings', protect, getUserSettings);
router.put('/:userId/settings', protect, updateUserSettings);

// Route for Uploading Profile Picture
router.post('/:id/upload', protect, uploadMiddleware, uploadProfilePicture);

export default router;
