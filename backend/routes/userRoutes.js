const express = require('express');
const { getUserProfile, updateUserProfile, followUser, unfollowUser } = require('../controllers/userController');
const router = express.Router();

// Get user profile
router.get('/:id', getUserProfile);

// Update user profile
router.put('/:id', updateUserProfile);

// Follow a user
router.post('/:id/follow', followUser);

// Unfollow a user
router.post('/:id/unfollow', unfollowUser);

module.exports = router;
