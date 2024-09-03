import express from 'express';
import uploadMiddleware from '../middlewares/uploadMiddleware.js';
import {
    getUserProfile,
    updateUserProfile,
    followUser,
    unfollowUser,
    getUserAnalytics,
    getUserSettings,
    updateUserSettings
} from '../controllers/userController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/:id', protect, getUserProfile);
router.put('/:id', protect, uploadMiddleware, updateUserProfile); // Use the upload middleware directly
router.post('/:id/follow', protect, followUser);
router.post('/:id/unfollow', protect, unfollowUser);
router.get('/analytics', protect, getUserAnalytics);
router.get('/:userId/settings', protect, getUserSettings);
router.put('/:userId/settings', protect, updateUserSettings);

export default router;
