const express = require('express');
const { getUserProfile, updateUserProfile, followUser, unfollowUser } = require('../controllers/userController');
const { authenticate } = require('../middlewares/authMiddleware');
const router = express.Router();

// Routes that require user to be authenticated
router.get('/:id', authenticate, getUserProfile); // Ensures user is logged in before accessing the profile
router.put('/:id', authenticate, updateUserProfile); // Protect profile updates
router.post('/:id/follow', authenticate, followUser); // Must be authenticated to follow
router.post('/:id/unfollow', authenticate, unfollowUser); // Must be authenticated to unfollow

module.exports = router;
