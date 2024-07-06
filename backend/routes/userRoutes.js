import express from 'express';
import {
    getUserProfile,
    updateUserProfile,
    followUser,
    unfollowUser
} from '../controllers/userController.js';
import { authenticate } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/:id', authenticate, getUserProfile);
router.put('/:id', authenticate, updateUserProfile);
router.post('/:id/follow', authenticate, followUser);
router.post('/:id/unfollow', authenticate, unfollowUser);

export default router;
