import express from 'express';
import { getUserProfile, updateUserProfile, followUser, unfollowUser, getUserAnalytics } from '../controllers/userController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/:id', getUserProfile);
router.put('/:id', protect, updateUserProfile);
router.post('/:id/follow', protect, followUser);
router.post('/:id/unfollow', protect, unfollowUser);
router.get('/analytics', protect, getUserAnalytics);

export default router;
