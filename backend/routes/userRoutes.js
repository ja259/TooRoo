const express = require('express');
const { getUserProfile, updateUserProfile, followUser, unfollowUser } = require('../controllers/userController');
const { authenticate } = require('../middlewares/authMiddleware');

const router = express.Router();

// Routes that require user authentication
router.get('/:id', authenticate, getUserProfile);
router.put('/:id', authenticate, updateUserProfile);
router.post('/:id/follow', authenticate, followUser);
router.post('/:id/unfollow', authenticate, unfollowUser);

module.exports = router;
