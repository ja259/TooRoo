const express = require('express');
const { createPost, getPosts, likePost, commentOnPost } = require('./controllers/postController');
const router = express.Router();

// Create a new post
router.post('/', createPost);

// Get all posts
router.get('/', getPosts);

// Like a post
router.put('/:id/like', likePost);

// Comment on a post
router.post('/:id/comment', commentOnPost);

module.exports = router;
