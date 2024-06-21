const express = require('express');
const {
    getUserProfile,
    updateUserProfile,
    followUser,
    unfollowUser
} = require('../controllers/userController');
const { authenticate } = require('../middlewares/authMiddleware');

const router = express.Router();

// Route to get a user's profile
router.get('/:id', authenticate, getUserProfile);

// Route to update a user's profile
router.put('/:id', authenticate, updateUserProfile);

// Route to follow a user
router.post('/:id/follow', authenticate, followUser);

// Route to unfollow a user
router.post('/:id/unfollow', authenticate, unfollowUser);

module.exports = router;

