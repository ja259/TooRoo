const express = require('express');
const { createPost, getPosts, likePost, commentOnPost, deletePost, getTimelinePosts } = require('../controllers/postController');
const { authenticate } = require('../middlewares/authMiddleware');
const multer = require('multer');

// Set up multer for file storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, './uploads/'),
    filename: (req, file, cb) => {
        const date = new Date().toISOString().replace(/:/g, '-');
        cb(null, `${date}-${file.originalname}`);
    }
});

// Define what file types are acceptable
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'), false);
    }
};

const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 }, fileFilter });

const router = express.Router();

// Post routes
router.post('/', authenticate, upload.single('postImage'), createPost); // Create a new post
router.get('/', authenticate, getPosts); // Get all posts
router.get('/timeline-posts', authenticate, getTimelinePosts); // Get timeline posts
router.put('/:id/like', authenticate, likePost); // Like a post
router.post('/:id/comment', authenticate, commentOnPost); // Comment on a post
router.delete('/:id', authenticate, deletePost); // Delete a post

module.exports = router;
