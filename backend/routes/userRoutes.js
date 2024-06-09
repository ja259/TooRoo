const express = require('express');
const { getUserProfile, updateUserProfile, followUser, unfollowUser } = require('../controllers/userController');
const { authenticate } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/:id', authenticate, getUserProfile); // Retrieve user profile
router.put('/:id', authenticate, updateUserProfile); // Update user profile
router.post('/:id/follow', authenticate, followUser); // Follow a user
router.post('/:id/unfollow', authenticate, unfollowUser); // Unfollow a user

module.exports = router;
